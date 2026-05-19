require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Project = require('../models/Project');
const slugify = require('../utils/slugify');

const APPLY_FLAG = '--apply';
const HELP_FLAGS = new Set(['--help', '-h']);
const FALLBACK_SLUG = 'project';

const printUsage = () => {
  console.log(`
Backfill missing project slugs.

Usage:
  node scripts/backfillProjectSlugs.js          # dry run only
  node scripts/backfillProjectSlugs.js --apply  # print summary, then apply

Environment:
  MONGODB_URI must point at the database to update. In non-production, the
  server fallback mongodb://localhost:27017/quanbao is used when MONGODB_URI is unset.
`);
};

const hasUsableSlug = (project) => typeof project.slug === 'string' && project.slug.trim() !== '';

const getProjectName = (project) => {
  if (typeof project.title === 'string' && project.title.trim()) return project.title.trim();
  if (typeof project.name === 'string' && project.name.trim()) return project.name.trim();
  return '';
};

const createUniqueSlug = (source, reservedSlugs) => {
  const baseSlug = slugify(source) || FALLBACK_SLUG;
  let candidate = baseSlug;
  let suffix = 2;

  while (reservedSlugs.has(candidate)) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  reservedSlugs.add(candidate);
  return candidate;
};

const hasStoredSlugField = (project) => Object.prototype.hasOwnProperty.call(project, 'slug');

const planBackfill = (projects) => {
  const reservedSlugs = new Set(
    projects
      .filter(hasUsableSlug)
      .map((project) => project.slug.trim())
  );

  const skipped = [];
  const updates = [];

  for (const project of projects) {
    if (hasUsableSlug(project)) {
      skipped.push({ id: project._id.toString(), reason: 'already has slug' });
      continue;
    }

    const source = getProjectName(project);
    const slug = createUniqueSlug(source, reservedSlugs);

    updates.push({
      id: project._id.toString(),
      source: source || FALLBACK_SLUG,
      slug,
      previousSlug: hasStoredSlugField(project) ? project.slug : undefined,
    });
  }

  return {
    total: projects.length,
    skipped,
    updates,
  };
};

const printSummary = (plan, { apply }) => {
  console.log('Project slug backfill dry-run summary');
  console.log('----------------------------------------');
  console.log(`Mode: ${apply ? 'apply after summary' : 'dry run only'}`);
  console.log(`Projects scanned: ${plan.total}`);
  console.log(`Projects already with slugs: ${plan.skipped.length}`);
  console.log(`Projects to update: ${plan.updates.length}`);

  if (plan.updates.length > 0) {
    console.log('\nPlanned updates:');
    for (const update of plan.updates) {
      console.log(`- ${update.id}: "${update.source}" -> ${update.slug}`);
    }
  }

  if (!apply) {
    console.log('\nNo changes applied. Re-run with --apply to write these slugs.');
  }
};

const buildMissingSlugGuard = (update) => {
  if (update.previousSlug === undefined) {
    return { slug: { $exists: false } };
  }

  return { slug: update.previousSlug };
};

const applyBackfill = async (updates) => {
  let applied = 0;
  let skipped = 0;

  for (const update of updates) {
    const result = await Project.updateOne(
      {
        _id: update.id,
        ...buildMissingSlugGuard(update),
      },
      { $set: { slug: update.slug } },
      { runValidators: true }
    );

    if (result.modifiedCount === 1) {
      applied += 1;
    } else {
      skipped += 1;
      console.log(`Skipped ${update.id}: slug was already changed before apply`);
    }
  }

  console.log('\nApply summary');
  console.log('-------------');
  console.log(`Applied: ${applied}`);
  console.log(`Skipped during apply: ${skipped}`);
};

const main = async () => {
  const args = process.argv.slice(2);
  if (args.some((arg) => HELP_FLAGS.has(arg))) {
    printUsage();
    return;
  }

  const unknownArgs = args.filter((arg) => arg !== APPLY_FLAG);
  if (unknownArgs.length > 0) {
    console.error(`Unknown option: ${unknownArgs.join(', ')}`);
    printUsage();
    process.exitCode = 1;
    return;
  }

  const apply = args.includes(APPLY_FLAG);

  await connectDB();

  const projects = await Project.collection
    .find({}, { projection: { title: 1, name: 1, slug: 1 } })
    .sort({ createdAt: 1, _id: 1 })
    .toArray();

  const plan = planBackfill(projects);
  printSummary(plan, { apply });

  if (apply && plan.updates.length > 0) {
    await applyBackfill(plan.updates);
  }
};

if (require.main === module) {
  main()
    .catch((error) => {
      console.error('Project slug backfill failed:', error.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      await mongoose.disconnect();
    });
}

module.exports = {
  createUniqueSlug,
  planBackfill,
};

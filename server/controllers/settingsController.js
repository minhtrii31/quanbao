const Setting = require('../models/Setting');
const { SanitizationError, sanitizeOptionalImageUrl, sanitizeOptionalLinkHref } = require('../utils/sanitizeContent');
const { isPlainObject } = require('../validation/schema');
const { validateFlatSettings } = require('../validation/cmsSchemas');

const SETTINGS_KEY = 'site';

const defaultSettings = {
  company: {
    name: 'CÔNG TY TNHH ĐẦU TƯ XÂY DỰNG QUÂN BẢO',
    tagline: 'UY TÍN VỮNG CHẮC - XÂY DỰNG ĐẲNG CẤP',
    address: 'Số 451/30 đường Xô Viết Nghệ Tĩnh, Phường 26, Quận Bình Thạnh, Thành phố Hồ Chí Minh',
    phone: '0938 888 888',
    phoneRaw: '0938888888',
    email: 'xaydungquanbao@gmail.com',
    workingHours: 'Thứ 2 - Thứ 7: 7:30 - 17:30'
  },
  social: {
    facebook: 'https://www.facebook.com/profile.php?id=100091774462739',
    zalo: 'https://zalo.me/093888888'
  },
  seo: {
    title: 'Quân Bảo Construction',
    description: 'Dịch vụ xây dựng, sửa chữa và thiết kế thi công chuyên nghiệp.',
    ogImage: ''
  }
};

const mergeSettings = (settings) => ({
  company: { ...defaultSettings.company, ...(settings?.company || {}) },
  social: { ...defaultSettings.social, ...(settings?.social || {}) },
  seo: { ...defaultSettings.seo, ...(settings?.seo || {}) }
});

const sanitizeSettings = (settings) => ({
  ...settings,
  social: {
    ...settings.social,
    facebook: sanitizeOptionalLinkHref(settings.social.facebook, 'facebook URL'),
    zalo: sanitizeOptionalLinkHref(settings.social.zalo, 'zalo URL')
  },
  seo: {
    ...settings.seo,
    ogImage: sanitizeOptionalImageUrl(settings.seo.ogImage, 'seo ogImage')
  }
});

const getOrCreateSettings = async () => {
  const setting = await Setting.findOneAndUpdate(
    { key: SETTINGS_KEY },
    { $setOnInsert: { value: defaultSettings } },
    { new: true, upsert: true }
  );

  return mergeSettings(setting.value);
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  if (!isPlainObject(req.body)) {
    return res.status(400).json({ success: false, message: 'Settings payload must be an object' });
  }

  try {
    const mergedSettings = mergeSettings(req.body);
    const validation = validateFlatSettings(mergedSettings);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const nextSettings = sanitizeSettings(validation.payload);
    await Setting.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { value: nextSettings },
      { new: true, upsert: true, runValidators: true }
    );

    req.auditResourceId = SETTINGS_KEY;
    res.json({ success: true, settings: nextSettings });
  } catch (error) {
    if (error instanceof SanitizationError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
};

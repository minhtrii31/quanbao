import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/**", async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    if (pathname.endsWith("/auth/me")) {
      await route.fulfill({
        status: 401,
        json: { message: "Unauthenticated" },
      });
    } else if (pathname.endsWith("/projects")) {
      await route.fulfill({
        json: { projects: [], total: 0, currentPage: 1, totalPages: 1 },
      });
    } else if (pathname.endsWith("/news")) {
      await route.fulfill({
        json: { news: [], total: 0, currentPage: 1, totalPages: 1 },
      });
    } else {
      await route.continue();
    }
  });
});

test("mobile navigation closes with the keyboard and after choosing a page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Mở menu", exact: true });
  await toggle.click();
  await expect(
    page.getByRole("button", { name: "Đóng menu", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page
    .getByRole("navigation", { name: "Điều hướng chính" })
    .getByRole("link", { name: "Giới thiệu", exact: true })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("header keeps the service section active on a detail page across screen sizes", async ({
  page,
}) => {
  await page.goto("/prices/sua-chua-nha", { waitUntil: "domcontentloaded" });
  const nav = page.getByRole("navigation", { name: "Điều hướng chính" });
  await expect(
    nav.getByRole("link", { name: "Dịch vụ", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  await expect(
    nav.getByRole("link", { name: "Dịch vụ", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    nav.getByRole("link", { name: "Trang chủ", exact: true }),
  ).not.toHaveAttribute("aria-current", "page");
});

test("hero controls change the displayed image and expose the current selection", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.getByRole("region", { name: "Giới thiệu Quân Bảo" });
  const image = hero.getByRole("img");
  await expect
    .poll(() =>
      image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  const original = await image.getAttribute("src");
  await hero.getByRole("button", { name: "Ảnh tiếp theo" }).click();
  await expect(image).not.toHaveAttribute("src", original!);
  await expect
    .poll(() =>
      image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  await expect(
    hero.getByRole("button", { name: "Chuyển đến ảnh 2" }),
  ).toHaveAttribute("aria-pressed", "true");
  await hero.getByRole("button", { name: "Ảnh trước" }).click();
  await expect(image).toHaveAttribute("src", original!);
});

test("keyboard users can skip directly to the main content", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  // Next.js adds a focusable dev-tools portal outside the app in development.
  if (
    await page.evaluate(
      () => document.activeElement?.tagName === "NEXTJS-PORTAL",
    )
  ) {
    await page.keyboard.press("Tab");
  }
  await expect(
    page.getByRole("link", { name: "Đến nội dung chính" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("contact form keeps validation and submits the entered details", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Gửi liên hệ", exact: true }).click();
  await expect(
    page.getByText("Vui lòng nhập họ tên.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Vui lòng nhập nội dung.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Họ tên").fill("Khách hàng kiểm thử");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("Điện thoại", { exact: true }).fill("0900000000");
  await page.getByLabel("Chủ đề").fill("Tư vấn xây nhà");
  await page
    .getByLabel("Nội dung", { exact: true })
    .fill("Tôi muốn trao đổi về phương án thiết kế nhà.");
  let payload: unknown;
  await page.route("**/api/contact", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ json: { success: true, message: "Success" } });
  });
  await page.getByRole("button", { name: "Gửi liên hệ", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Quân Bảo đã nhận" }),
  ).toBeVisible();
  expect(payload).toEqual({
    name: "Khách hàng kiểm thử",
    email: "test@example.com",
    phone: "0900000000",
    subject: "Tư vấn xây nhà",
    message: "Tôi muốn trao đổi về phương án thiết kế nhà.",
  });
  await expect(page.getByLabel("Họ tên")).toHaveValue("");
});

test("project page recovers from an API error when retried", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/projects**", async (route) => {
    requests++;
    if (requests === 1) {
      await route.fulfill({
        status: 503,
        json: { message: "Temporarily unavailable" },
      });
    } else {
      await route.fulfill({
        json: { projects: [], total: 0, currentPage: 1, totalPages: 1 },
      });
    }
  });
  await page.goto("/projects");
  await page.getByRole("button", { name: "Thử lại", exact: true }).click();
  await expect(
    page.getByText("Chưa có dự án nào.", { exact: true }),
  ).toBeVisible();
  expect(requests).toBe(2);
});

test("public pages fit both phone and desktop viewports", async ({ page }) => {
  test.setTimeout(60_000);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/about",
      "/prices",
      "/projects",
      "/news",
      "/contact",
      "/login",
    ]) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), path).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }), path).toHaveCount(
        1,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} at ${width}px`,
      ).toBe(true);
    }
  }
});

test("project pagination appends the next page and keeps existing projects", async ({
  page,
}) => {
  const project = {
    _id: "project-test-1",
    slug: "cong-trinh-kiem-thu-1",
    title: "Công trình kiểm thử 1",
    category: "Nhà ở",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600",
    description: "Hồ sơ dùng để kiểm thử phân trang.",
    content: "Nội dung kiểm thử.",
    status: "published",
    featured: false,
    createdAt: "2026-11-21T00:00:00.000Z",
    updatedAt: "2026-11-21T00:00:00.000Z",
  };
  await page.route("**/api/projects**", async (route) => {
    const currentPage = Number(
      new URL(route.request().url()).searchParams.get("page"),
    );
    await route.fulfill({
      json: {
        projects:
          currentPage === 1
            ? [project]
            : [
                {
                  ...project,
                  _id: "project-test-2",
                  slug: "cong-trinh-kiem-thu-2",
                  title: "Công trình kiểm thử 2",
                },
              ],
        currentPage,
        totalPages: 2,
        total: 2,
      },
    });
  });
  await page.goto("/projects", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: "Công trình kiểm thử 1", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Xem thêm", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Công trình kiểm thử 1", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Công trình kiểm thử 2", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Xem thêm", exact: true }),
  ).toHaveCount(0);
});

test("unauthenticated admin access redirects to login and password visibility works", async ({
  page,
}) => {
  await page.goto("/admin", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/login(?:\?|$)/);
  const password = page.getByLabel("Mật khẩu", { exact: true });
  await password.fill("test-password");
  await expect(password).toHaveAttribute("type", "password");
  await page
    .getByRole("button", { name: "Hiện mật khẩu", exact: true })
    .click();
  await expect(password).toHaveAttribute("type", "text");
  await expect(password).toHaveValue("test-password");
  await page.getByRole("button", { name: "Ẩn mật khẩu", exact: true }).click();
  await expect(password).toHaveAttribute("type", "password");
});

test("admin navigation works on desktop and closes after mobile navigation", async ({
  context,
  page,
}) => {
  await context.addCookies([
    {
      name: "quanbao_admin_token",
      value: "ui-test-session",
      domain: "localhost",
      path: "/",
    },
  ]);
  await page.route("**/api/auth/me", (route) =>
    route.fulfill({
      json: {
        user: {
          _id: "admin-test",
          name: "Quản trị kiểm thử",
          email: "admin@example.com",
          role: "admin",
          createdAt: "2026-11-21T00:00:00.000Z",
          updatedAt: "2026-11-21T00:00:00.000Z",
        },
      },
    }),
  );
  await page.route("**/api/stats", (route) =>
    route.fulfill({
      json: { success: true, news: 0, projects: 0, contacts: 0 },
    }),
  );
  await page.goto("/admin", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("navigation", { name: "Điều hướng quản trị", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Bảng điều khiển",
      exact: true,
    }),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Điều hướng quản trị di động" })
    .getByRole("link", { name: "Dự án", exact: true })
    .click();
  await expect(page).toHaveURL(/\/admin\/projects$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Dự án", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Mở menu", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.route("**/api/auth/logout", (route) =>
    route.fulfill({ json: { success: true } }),
  );
  await page.getByRole("button", { name: "Mở menu", exact: true }).click();
  await page
    .getByRole("button", { name: "Mở menu tài khoản", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Đăng xuất", exact: true })
    .click({ timeout: 3000 });
  await expect(page).toHaveURL(/\/login$/);
});

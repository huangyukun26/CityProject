import { test, expect } from "@playwright/test";

const login = async (page: any, role: string) => {
  await page.goto("/login");
  await page.getByLabel("用户名").fill("tester");
  await page.getByLabel("密码").fill("123");
  await page.getByLabel("角色").selectOption(role);
  await page.getByRole("button", { name: "登录" }).click();
  await expect(page.getByText("项目概览")).toBeVisible();
};

test("User login -> import -> submit approval", async ({ page }) => {
  await login(page, "User");
  await page.getByRole("link", { name: "数据集" }).click();
  await page.getByRole("link", { name: "查看详情" }).first().click();

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: "sample.csv",
    mimeType: "text/csv",
    buffer: Buffer.from("NIR,Red\n0.6,0.2\n0.4,0.1")
  });

  await expect(page.getByText("上传文件")).toBeVisible();
  await page.getByRole("button", { name: "提交审核" }).click();
  await expect(page.getByText("Submitted")).toBeVisible();
});

test("Reviewer approves dataset", async ({ page }) => {
  await page.addInitScript(() => {
    const datasets = [
      {
        id: "ds-approve",
        name: "待审数据集",
        description: "",
        createdAt: new Date().toISOString(),
        status: "Submitted",
        files: []
      }
    ];
    localStorage.setItem("datasets", JSON.stringify(datasets));
  });

  await login(page, "Reviewer");
  await page.getByRole("link", { name: "审批流" }).click();
  await page.getByRole("button", { name: "待审数据集" }).click();
  await page.getByRole("button", { name: "通过" }).click();
  await expect(page.getByText("已通过")).toBeVisible();
});

test("NDVI compute and chart", async ({ page }) => {
  await page.addInitScript(() => {
    const datasets = [
      {
        id: "ds-ndvi",
        name: "NDVI 数据集",
        description: "",
        createdAt: new Date().toISOString(),
        status: "Draft",
        files: [
          {
            id: "file-ndvi",
            name: "sample.csv",
            size: 10,
            type: "text/csv",
            progress: 100,
            content: "NIR,Red\n0.6,0.2\n0.4,0.1"
          }
        ]
      }
    ];
    localStorage.setItem("datasets", JSON.stringify(datasets));
  });
  await login(page, "User");
  await page.getByRole("link", { name: "NDVI" }).click();
  await page.getByRole("combobox").first().selectOption("ds-ndvi");
  await page.getByRole("combobox").nth(1).selectOption("file-ndvi");
  await page.getByRole("button", { name: "计算 NDVI" }).click();
  await expect(page.getByAltText("ndvi")).toBeVisible();
});

test("Report export triggers download", async ({ page }) => {
  await login(page, "User");
  await page.getByRole("link", { name: "报告" }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出 PDF" }).click();
  const download = await downloadPromise;
  expect(await download.path()).toBeTruthy();
});

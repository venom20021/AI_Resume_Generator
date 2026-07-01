import puppeteer from "puppeteer";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const SCREENSHOTS_DIR = path.resolve("public/screenshots");
const BASE_URL = "http://localhost:3000";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await wait(1000);
  }
  throw new Error("Server did not start in time");
}

async function clickButton(page, text) {
  await page.evaluate((btnText) => {
    const buttons = document.querySelectorAll("button");
    for (const btn of buttons) {
      if (btn.textContent.trim() === btnText) {
        btn.click();
        return;
      }
    }
    for (const btn of buttons) {
      if (btn.textContent.trim().includes(btnText)) {
        btn.click();
        return;
      }
    }
  }, text);
  await wait(500);
}

async function fillField(page, id, value) {
  const el = await page.$(`#${id}`);
  if (el) {
    await el.click({ clickCount: 3 });
    await el.type(value, { delay: 20 });
  }
}

async function main() {
  console.log("Starting Next.js dev server...");
  const server = spawn("npm", ["run", "dev"], {
    stdio: "ignore",
    shell: true,
    env: { ...process.env, GOOGLE_GENERATIVE_AI_API_KEY: "placeholder" },
  });

  try {
    await waitForServer(BASE_URL);
    console.log("Server is ready. Launching browser...");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // ═══ 1. Empty state ═══
    console.log("[1/6] Empty state...");
    await page.goto(BASE_URL, { waitUntil: "networkidle0" });
    await wait(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "empty-state.png") });

    // ═══ 2. Personal info with data ═══
    console.log("[2/6] Personal info step...");
    await page.goto(BASE_URL, { waitUntil: "networkidle0" });
    await wait(500);
    await fillField(page, "fullName", "Alex Johnson");
    await fillField(page, "email", "alex@example.com");
    await fillField(page, "phone", "+1 (555) 123-4567");
    await fillField(page, "location", "San Francisco, CA");
    await fillField(page, "linkedIn", "linkedin.com/in/alexjohnson");
    await fillField(page, "website", "alexjohnson.dev");
    await fillField(
      page,
      "summary",
      "Senior full-stack engineer with 6+ years of experience building scalable web applications. Passionate about developer tooling and AI-powered products."
    );
    await wait(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "personal-info.png") });

    // ═══ 3. Experience step ═══
    console.log("[3/6] Experience step...");
    await clickButton(page, "Experience");
    await wait(400);
    await clickButton(page, "Add Experience");
    await wait(400);
    const inputs = await page.$$("input");
    for (const input of inputs) {
      const placeholder = await input.evaluate((el) => el.placeholder);
      if (placeholder.includes("Acme")) {
        await input.click({ clickCount: 3 });
        await input.type("TechCorp Inc.", { delay: 15 });
      } else if (placeholder.includes("Senior")) {
        await input.click({ clickCount: 3 });
        await input.type("Senior Software Engineer", { delay: 15 });
      }
    }
    await wait(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "experience-step.png") });

    // ═══ 4. Job Match step ═══
    console.log("[4/6] Job Match step...");
    await clickButton(page, "Job Match");
    await wait(400);
    await clickButton(page, "Add Job Description");
    await wait(400);
    const textareas = await page.$$("textarea");
    if (textareas.length > 0) {
      await textareas[textareas.length - 1].type(
        "We are looking for a Senior Software Engineer to join our team. " +
          "You will build and maintain cloud-native applications using React, Node.js, and AWS. " +
          "Strong problem-solving skills and experience with microservices architecture required.",
        { delay: 8 }
      );
    }
    await wait(500);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "job-match.png") });

    // ═══ 5. Classic template ═══
    console.log("[5/6] Classic template...");
    await page.goto(BASE_URL, { waitUntil: "networkidle0" });
    await wait(500);
    await fillField(page, "fullName", "Alex Johnson");
    await fillField(page, "email", "alex@example.com");
    await fillField(page, "summary", "Senior full-stack engineer building AI-powered products.");
    await clickButton(page, "Experience");
    await wait(300);
    await clickButton(page, "Add Experience");
    await wait(300);
    await clickButton(page, "Classic");
    await wait(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "classic-template.png") });

    // ═══ 6. Minimal template ═══
    console.log("[6/6] Minimal template...");
    await clickButton(page, "Minimal");
    await wait(1000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "minimal-template.png") });

    await browser.close();
    console.log("\nAll 6 screenshots saved to:", SCREENSHOTS_DIR);

    // Verify files
    const files = ["empty-state.png", "personal-info.png", "experience-step.png", "job-match.png", "classic-template.png", "minimal-template.png"];
    for (const f of files) {
      const p = path.join(SCREENSHOTS_DIR, f);
      const exists = fs.existsSync(p);
      const size = exists ? fs.statSync(p).size : 0;
      console.log(`  ${f}: ${exists ? (size / 1024).toFixed(1) + " KB" : "MISSING"}`);
    }
  } finally {
    server.kill();
    console.log("Dev server stopped.");
  }
}

main().catch((err) => {
  console.error("Screenshot script failed:", err);
  process.exit(1);
});

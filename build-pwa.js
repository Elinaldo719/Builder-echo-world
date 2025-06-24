#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🚀 Preparando build do PWA...");

// Verificar se os ícones existem
const iconsDir = path.join(__dirname, "public/icons");
if (!fs.existsSync(iconsDir)) {
  console.error("❌ Diretório de ícones não encontrado!");
  process.exit(1);
}

// Verificar manifest.json
const manifestPath = path.join(__dirname, "public/manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.error("❌ manifest.json não encontrado!");
  process.exit(1);
}

// Verificar service worker
const swPath = path.join(__dirname, "public/sw.js");
if (!fs.existsSync(swPath)) {
  console.error("❌ Service Worker não encontrado!");
  process.exit(1);
}

console.log("✅ Todos os arquivos PWA estão presentes");
console.log("📦 Iniciando build...");

// Executar build do Vite
const { execSync } = require("child_process");

try {
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Build concluído com sucesso!");
  console.log("🎉 PWA pronto para deploy!");
} catch (error) {
  console.error("❌ Erro no build:", error.message);
  process.exit(1);
}

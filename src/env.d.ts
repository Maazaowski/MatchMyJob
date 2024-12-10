/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_KEY: string
  readonly VITE_ANTHROPIC_KEY: string
  readonly VITE_GEMINI_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
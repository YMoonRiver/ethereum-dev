import { defineConfig } from '@wagmi/cli'
import { foundry, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'contracts/generated.ts',
  plugins: [
    foundry({
      project: '../foundry',
    }),
    react(),
  ],
})

// import { defineConfig } from '@wagmi/cli'
// import { foundry, react } from '@wagmi/cli/plugins'

// export default defineConfig({
//   out: 'contracts/generated.ts',
//   plugins: [
//     foundry({
//       project: '../foundry',
//     }),
//     react(), // 👈 关键！！！
//   ],
// })
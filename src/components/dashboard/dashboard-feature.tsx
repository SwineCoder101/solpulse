'use client'

import { AppHero } from '../ui/ui-layout'

const links: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  { label: 'Solana Developers GitHub', href: 'https://github.com/solana-developers/' },
  { label: 'Solana lighthouse', href: 'https://solana-file-explorer.netlify.app/' },
  { label: 'Solana IDE', href: 'https://solana-ide.netlify.app/' },
]

export default function DashboardFeature() {
  return (
    <div>
      <AppHero title="SOLPULSE" subtitle="Welcome To SolPulse" />
      <div className="flex justify-center py-4">
        <img className="h-20 md:h-24" alt="Logo" src="/solpulse.webp" />
      </div>
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">
          <p>A collaboration dev tool to understand Solana Programs, Accounts, Instructions for deployed applications on devnet/localnet/mainet, please connect your wallet</p>
          <p>Inspired by: </p>
          {links.map((link, index) => (
            <div key={index}>
              <a href={link.href} className="link" target="_blank" rel="noopener noreferrer">
                {link.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
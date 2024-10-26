# SolPulse

SolPulse is an interactive and intuitive dashboard designed to provide developers with a comprehensive view of the deployed programs on the Solana blockchain. By visualizing the full content of these programs, including accounts, instructions, and relationships, SolPulse simplifies the often complex development workflow in the Solana ecosystem.

## Summary

SolPulse is created to streamline the process of understanding and developing on Solana by giving developers a unified, graph-based view of their deployed programs. It helps developers visualize, debug, and optimize their programs more efficiently, making the Solana development experience easier and more cohesive. SolPulse enhances productivity by reducing friction during development and providing real-time, actionable insights.

## Overview

The Solana blockchain offers developers a powerful and scalable environment for building decentralized applications (dApps). However, understanding the various deployed programs, accounts, and the relationships between them can be challenging. SolPulse aims to solve this problem by offering an interactive visual dashboard to explore and analyze the full architecture of smart contracts on Solana.

### Features
- **Comprehensive Visual Representation**: SolPulse provides a graph-based visualization of Solana programs, accounts, and their relationships, making it easy for developers to understand how different components interact.
- **Interactive Exploration**: Users can navigate through different programs, drill down into specific accounts, and visualize the flow of instructions, helping to make debugging and optimization straightforward.
- **Real-time Insights**: Stay informed with real-time updates and insights into the state of deployed programs, enabling developers to make quick, informed decisions.
- **Seamless Development Workflow**: The platform's intuitive interface reduces the friction that developers often face when trying to understand on-chain programs, boosting productivity.

## Getting Started

To get started with SolPulse, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/SwineCoder101/solpulse.git
   ```

2. Install the dependencies:
   ```bash
   cd solpulse
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the SolPulse dashboard.

## Project Layout

The project structure is organized as follows:

```
solpulse
├── anchor
├── next-env.d.ts
├── next.config.mjs
├── node_modules
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
├── src
├── tailwind.config.ts
├── test-ledger
└── tsconfig.json
```

- **anchor**: Contains Anchor framework files for managing Solana programs.
- **src**: Source code for the SolPulse application.
- **public**: Static assets used in the application.
- **test-ledger**: Local Solana test ledger for development purposes.

## Scripts

The following scripts are available in the `package.json` file:

- **anchor**: Run Anchor CLI commands.
- **anchor-build**: Build Anchor programs.
- **anchor-localnet**: Start a localnet using Anchor.
- **anchor-test**: Run tests for Anchor programs.
- **dev**: Start the Next.js development server.
- **build**: Build the Next.js application.
- **start**: Start the production server.
- **lint**: Run ESLint to lint the codebase.

## Usage

SolPulse is built for developers working with Solana smart contracts. Use the dashboard to:

- **Visualize**: See the entire architecture of your deployed programs.
- **Debug**: Identify issues by analyzing how different accounts and instructions interact.
- **Optimize**: Use the detailed insights provided to optimize program performance.

## Demo

Below are some screenshots of SolPulse in action:

### Dashboard Overview
![Dashboard Overview](images/dashboard_overview.png)

### Program Details
![Program Details](images/program_details.png)

### Real-time Updates
![Real-time Updates](images/real_time_updates.png)

These images provide a glimpse into the intuitive interface that helps developers visualize and manage their Solana programs.

## Technologies Used

- **Solana Blockchain**: To access on-chain data and visualize the deployed programs.
- **React**: For building the user interface.
- **Chakra UI**: To provide a modern, responsive design system for the dashboard.
- **React Flow Renderer**: For the graph-based visualization of programs and their relationships.

## Contributing

We welcome contributions! Please feel free to submit issues, fork the repository, and make pull requests.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

If you have any questions or feedback, feel free to reach out:

- **Email**: [contact@solpulse.com](mailto:contact@solpulse.com)
- **Twitter**: [@SolPulseDev](https://twitter.com/SolPulseDev)

## Acknowledgments

We are grateful to the Solana developer community for their continuous support and contributions. SolPulse is built with the aim of making Solana development more transparent and productive for everyone.

## Inspiration

SolPulse was inspired by tools like [Solana IDE](https://solana-ide.netlify.app/), an interactive tool for creating programs using AI, and [Solana File Explorer](https://solana-file-explorer.netlify.app/), a developer tool for viewing program, IDL, and account information.


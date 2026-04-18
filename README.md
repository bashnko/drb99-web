<div align="center">
  <img src="https://i.postimg.cc/nhdrQY9Z/drb99.png" alt="drb99 logo" width="400" />

  <p>The official web interface for drb99. Painlessly generate distribution wrappers for your Go CLI projects.</p>

  <p>
    <a href="https://github.com/amanyxdev/drb99-web/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-orange.svg" alt="License: AGPL-3.0"></a>
    <img src="https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white" alt="Built with Next.js" />
  </p>
</div>

---

**drb99-web** is the official graphical user interface for the drb99 API. It provides a sleek, user-friendly, dark-mode experience for generating distribution configurations without ever touching the terminal.

## Features

- **Interactive Forms:** Beautifully designed forms to easily configure your Go CLI deployments.
- **Support for Multiple Workflows:**
  - **npm wrapper generation** (automatically create `package.json`, `install.js`, `index.js`, etc.)
  - **GoReleaser configuration** (coming soon/optional integration)
- **Live Previews & Downloads:** Easily review the generated code right in your browser and download the `.zip` archive to use immediately.
- **Modern Tech Stack:** Built using Next.js, Tailwind CSS, and optimized for performance and accessibility.

## Getting Started

To run the web application locally, ensure you have Node.js installed, then clone the repository:

```bash
git clone https://github.com/yourusername/drb99-web.git
cd drb99-web

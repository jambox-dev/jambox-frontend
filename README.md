# Jambox - Collaborative Music Queue


[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

**Tags/Labels:** `angular`, `typescript`, `tailwind-css`, `music`, `queue`, `spotify`, `youtube`, `collaboration`, `pwa`

Jambox is a collaborative, real-time music queueing application that allows multiple users to add and vote on songs for a shared listening experience. It's perfect for parties, offices, or any social gathering where music is shared. Users can easily add songs from YouTube and Spotify, and the queue is updated in real-time for everyone.

## Key Features

*   **Collaborative Queue:** Users can add songs from YouTube and Spotify to a shared, real-time playlist.
*   **QR Code Access:** Easily invite guests to join the queue by scanning a QR code—no app download required.
*   **Admin Dashboard:** A password-protected admin panel to manage the queue and application settings.
*   **Song Blacklist:** Admins can blacklist specific songs to prevent them from being added to the queue.
*   **Multi-language Support:** The interface is available in multiple languages thanks to `ngx-translate`.
*   **Responsive Design:** A clean, modern UI built with Tailwind CSS that works on any device.

## Tech Stack

*   **Framework:** [Angular](https://angular.io/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Real-time Updates:** [RxJS](https://rxjs.dev/)
*   **Internationalization:** [ngx-translate](https://github.com/ngx-translate/core)
*   **QR Code Generation:** [qrcode](https://github.com/soldair/node-qrcode)

## Development

For a detailed guide on local setup, architecture, and coding standards, please see the [Developer Guide](docs/DEVELOPER_GUIDE.md).

## Future Development

We have many ideas for improving Jambox! Here are a few possibilities:

*   **User Voting System:** Allow users to upvote or downvote songs in the queue to influence playback order.
*   **More Music Sources:** Integrate with other music streaming services like Apple Music or SoundCloud.
*   **Customizable Themes:** Let users personalize the look and feel of the application.
*   **Progressive Web App (PWA):** Add offline capabilities and make the app installable on mobile devices.

## Contributing

We welcome contributions from the community! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them with clear, descriptive messages.
4.  Push your changes to your fork.
5.  Open a pull request to the `main` branch of this repository.

Please ensure your code follows the existing style and that all tests pass before submitting a pull request.

---
*This README was generated with the help of Kilo Code.*

import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Clueminati '25",
    short_name: 'Clueminati',
    description: 'The official application for Clueminati 2025 by CodeChef-VIT',
    start_url: '/',
    display: 'standalone',
    background_color: '#1c0a0a',
    theme_color: '#550d08',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
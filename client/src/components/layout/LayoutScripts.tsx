'use client';

import { useEffect } from 'react';
import { THEME_BASE, THEME_VERSION } from '@/constants/layout/assets';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function initLayoutMenu() {
  const MenuCtor = (
    window as Window & {
      Menu?: new (
        element: Element,
        options: { orientation: string; closeChildren: boolean },
      ) => void;
    }
  ).Menu;

  document.querySelectorAll('#layout-menu').forEach((element) => {
    if (MenuCtor) {
      new MenuCtor(element, {
        orientation: 'vertical',
        closeChildren: false,
      });
    }
  });

  document.querySelectorAll('.layout-menu-toggle').forEach((item) => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      document.documentElement.classList.toggle('layout-menu-expanded');
    });
  });
}

export function LayoutScripts() {
  useEffect(() => {
    let cancelled = false;
    const version = `?v=${THEME_VERSION}`;
    const scripts = [
      `${THEME_BASE}/js/config.js${version}`,
      `${THEME_BASE}/vendor/js/helpers.js${version}`,
      `${THEME_BASE}/vendor/libs/popper/popper.js${version}`,
      `${THEME_BASE}/vendor/js/bootstrap.js${version}`,
      `${THEME_BASE}/vendor/libs/perfect-scrollbar/perfect-scrollbar.js${version}`,
      `${THEME_BASE}/vendor/js/menu.js${version}`,
    ];

    (async () => {
      for (const src of scripts) {
        if (cancelled) return;
        await loadScript(src);
      }

      if (!cancelled) {
        initLayoutMenu();
      }
    })().catch((error: unknown) => {
      console.error('Failed to initialize layout scripts', error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

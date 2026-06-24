import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // ---------- Auth ----------
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'auth/role-select',
    loadComponent: () =>
      import('./auth/pages/role-select/role-select.page').then((m) => m.RoleSelectPage),
  },
  // 👇 NUEVA RUTA PARA RECUPERAR CONTRASEÑA
  {
    path: 'auth/recover',
    loadComponent: () =>
      import('./auth/pages/recover-password/recover-password.page').then(
        (m) => m.RecoverPasswordPage,
      ),
  },

  // ---------- App (protegidas) ----------
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard(['ADMIN', 'SELLER'])],
        loadComponent: () =>
          import('./modules/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'clients',
        canActivate: [roleGuard(['ADMIN', 'SELLER'])],
        loadComponent: () => import('./modules/clients/clients.page').then((m) => m.ClientsPage),
      },
      {
        path: 'products',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () => import('./modules/products/products.page').then((m) => m.ProductsPage),
      },
      {
        path: 'sales',
        canActivate: [roleGuard(['ADMIN', 'SELLER'])],
        loadComponent: () => import('./modules/sales/sales.page').then((m) => m.SalesPage),
      },
      {
        path: 'inventory',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () =>
          import('./modules/inventory/inventory.page').then((m) => m.InventoryPage),
      },
      {
        path: 'reports',
        canActivate: [roleGuard(['ADMIN'])],
        loadComponent: () => import('./modules/reports/reports.page').then((m) => m.ReportsPage),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // Ruta comodín (404)
  { path: '**', redirectTo: 'auth/login' },
];

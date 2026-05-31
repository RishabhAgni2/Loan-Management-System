import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const DASHBOARD_ROLES = ['admin', 'sales', 'sanction', 'disbursement', 'collection'];
const BORROWER_ROLES = ['borrower'];
const ROLE_HOME_PATHS: Record<string, string> = {
  admin: '/dashboard',
  sales: '/dashboard/sales',
  sanction: '/dashboard/sanction',
  disbursement: '/dashboard/disbursement',
  collection: '/dashboard/collection',
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('lms_token')?.value;
  const role = request.cookies.get('lms_role')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isDashboard = pathname.startsWith('/dashboard');
  const isApply = pathname.startsWith('/apply');

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    if (role && DASHBOARD_ROLES.includes(role)) {
      return NextResponse.redirect(new URL(ROLE_HOME_PATHS[role] || '/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/apply/personal', request.url));
  }

  if (isDashboard && role && BORROWER_ROLES.includes(role)) {
    return NextResponse.redirect(new URL('/apply/personal', request.url));
  }

  if (isApply && role && DASHBOARD_ROLES.includes(role)) {
    return NextResponse.redirect(new URL(ROLE_HOME_PATHS[role] || '/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/apply/:path*', '/login', '/signup'],
};

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to RentFlow</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #111827;
        }

        .card-accent {
            height: 6px;
            background: linear-gradient(90deg, #2563eb, #7c3aed);
        }

        .card-body {
            padding: 40px 40px 32px;
        }

        .greeting {
            font-size: 22px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
        }

        .subtitle {
            font-size: 15px;
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 32px;
        }

        .credentials {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
        }

        .credentials-title {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #9ca3af;
            margin-bottom: 16px;
        }

        .credential-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        .credential-row:last-child {
            border-bottom: none;
        }

        .credential-label {
            font-size: 13px;
            color: #6b7280;
            font-weight: 500;
        }

        .credential-value {
            font-size: 14px;
            font-weight: 600;
            font-family: 'Courier New', monospace;
            background: #e0e7ff;
            color: #3730a3;
            padding: 4px 10px;
            border-radius: 6px;
        }

        .btn-wrapper {
            text-align: center;
            margin-bottom: 32px;
        }

        .btn {
            display: inline-block;
            background: #2563eb;
            color: #ffffff !important;
            text-decoration: none;
            font-size: 15px;
            font-weight: 600;
            padding: 14px 36px;
            border-radius: 10px;
            letter-spacing: 0.02em;
        }

        .security-note {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 10px;
            padding: 14px 18px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .security-icon {
            font-size: 18px;
            flex-shrink: 0;
            margin-top: 1px;
        }

        .security-text {
            font-size: 13px;
            color: #92400e;
            line-height: 1.5;
        }

        .footer {
            text-align: center;
            padding: 28px 40px 32px;
            border-top: 1px solid #f3f4f6;
        }

        .footer-text {
            font-size: 13px;
            color: #9ca3af;
            line-height: 1.6;
        }

        .footer-brand {
            font-weight: 700;
            color: #2563eb;
        }
    </style>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0"
        style="background-color:#f3f4f6; padding:40px 16px;">
        <tr>
            <td align="center">

                <!-- Logo -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="max-width:560px; margin-bottom:24px;">
                    <tr>
                        <td align="center">
                            <span style="font-size:26px; font-weight:800; color:#2563eb;
                                font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
                                letter-spacing:-0.5px;">
                                🏢 RentFlow
                            </span>
                        </td>
                    </tr>
                </table>

                <!-- Card -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="max-width:560px; background:#ffffff; border-radius:16px;
                        overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08);">

                    <!-- Accent bar -->
                    <tr>
                        <td style="height:6px;
                            background:linear-gradient(90deg,#2563eb,#7c3aed);
                            border-radius:16px 16px 0 0;">
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:40px 40px 32px;">

                            <!-- Greeting -->
                            <p class="greeting">Welcome, {{ $tenant->name }}! 👋</p>
                            <p class="subtitle">
                                Your landlord has created an account for you on
                                <strong>RentFlow</strong>. You can now log in to view
                                your lease, track payments, and submit maintenance requests.
                            </p>

                            <!-- Credentials -->
                            <div class="credentials">
                                <p class="credentials-title">Your Login Credentials</p>

                                <div class="credential-row">
                                    <span class="credential-label">Email</span>
                                    <span class="credential-value">{{ $tenant->email }}</span>
                                </div>
                                <div class="credential-row">
                                    <span class="credential-label">Password</span>
                                    <span class="credential-value">{{ $password }}</span>
                                </div>
                            </div>

                            <!-- CTA Button -->
                            <div class="btn-wrapper">
                                <a href="{{ config('app.frontend_url') }}/login" class="btn">
                                    Login to RentFlow →
                                </a>
                            </div>

                            <!-- Security note -->
                            <div class="security-note">
                                <span class="security-icon">⚠️</span>
                                <span class="security-text">
                                    For your security, please change your password
                                    immediately after your first login. Do not share
                                    your credentials with anyone.
                                </span>
                            </div>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td class="footer">
                            <p class="footer-text">
                                This email was sent by
                                <span class="footer-brand">RentFlow</span>.<br/>
                                If you did not expect this email,
                                please contact your landlord.
                            </p>
                        </td>
                    </tr>

                </table>

                <!-- Bottom spacing -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                    style="max-width:560px; margin-top:24px;">
                    <tr>
                        <td align="center">
                            <p style="font-size:12px; color:#9ca3af;">
                                © {{ date('Y') }} RentFlow. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>

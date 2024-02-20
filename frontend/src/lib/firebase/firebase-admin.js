import "server-only";

import { cookies } from "next/headers";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export const firebaseApp =
  getApps().find((it) => it.name === "firebase-admin-app") ||
  initializeApp(
    {
      credential: cert({
        type: "service_account",
        project_id: "gdsc-solution-challenge-4245d",
        private_key_id: "f663104c9959b4ae7cefbd77fb3ef7a70f18e7b4",
        private_key:
          "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC/z/9+PDkB8qwt\nI/7dAyweVDx6504Gs7TmqNVYj2MePayyG4j55L5Mr42T05X322mQwws38C5JPXne\n5bbuOr3b9wKI4AsGwJdP1yQ7PH/BvbVflXpMi7KrNC4wpbLOdBoH837zMHasx87u\ncOw6arC6gAw29XYq3tK/HCUKyjlp2JbxeEkXKN4UdCysKkDE2KbL4tmcNvemB3la\nYmfc40yZOKc8Jsc6hro9k28lDbWLFBBs/uJ2kNxSlWAt+oX3ta+3CG0kTzaBZ71X\nfJ7UyckSansZhkqaXD9AVWJf/kYFdArSBFMPKh5k71GOZV9VdxypOYbUCz8c2aCJ\nfYRoY9hfAgMBAAECggEANkwzDxENMjf39W9THk1fl9ZQqJoBxHPqqcDxY/hzHoRm\n9qREyjiuhhbMBSTINzmtUIVmD5e2ApWcgjSU7CtEw5fQ595EQM0UCE3mu74MjFOf\nnEc8L578HOrQiITfcQH8vHN5ZG47qf2F3omo1YCONr04t/YUVV5uWhslgUBtsEBa\nRMlPbketvzV5bW6A0oWw7GU7qTM7PilyO3cdnhEL8DU8aa05S+fpQMTlT/MWy+3r\n+IKL1Y6W9jWoHd7f+8BYNXRMOc/HglQrmSovXa+8d2+gXKwlymTcHpNOPWp4uT1r\nSa9ZY2FLfy3R1WeUTUHI9d+c32ha1V2keOVpy1ZWgQKBgQDeaP214mRcEo2BT2jm\ncqVZjt4wJlDyA8Z91YrGca0tAf9lD73sliIao29F6ZaVZTH05hpsc3lxBli6NhYx\neYkOVdtxgSIWyMrjNKZT/0Kcd44aftAdOq51wI8rLtdwtgpTMQeChbzCkzAVdlty\nF3N2nWrmuJAEv0q+Nwyk+tnLpwKBgQDcyAP0k/Aq7FSAROlWxj5LHLLcQz5ikKMB\naY6JK91XGc07H5TcD8nIN5YczS2C2jMGy3dxmE7+mv5MuPtugl1egx1It6drpFww\n1LW4H9WiLyv5G3ozPqKMLxXaO0xILXAOvac305LoV6KEzEpDD5DBNRYC7A0GgzIE\nyN2uvAbEiQKBgHwEj3SciNnOfplcbmISC6GkyMCQnRJWiJgiOv/s42P1eTQhUwZZ\nsSqpd6LEXfNwOisVJCbVPSKJJ3CuODHeU05rEbJ5D0klLf0Dnru32qzk/ZhInkOu\nNRn0BeFOfVOcLqW08TsW1+qnqGhPVy6HZRr/LFz7DVOYV1U53RMhzdCBAoGAXxFR\ngrNhK1pwWHtT7qWWlUlaSzY5Wr/lMOp/EdntiV/224qR0uCJhslIvkYrXrkOV9Kt\nMCDhgwjCj87nlYJVKilTJsjOMq+ncu9lAE/U8e1WBgIq8H38CFkOE9aM1leadP59\nTrCwBZQWyxAcuhutvURaog963F8J3r2Pl3onf+ECgYBKD2eITrhyG+ZLIwj5vlH/\ng6RHiusblX1GtunmaYT0WSSmAW5nLyysDU/X+xZTQQH5N1fWN98PeG8iNWwuui85\nMfbxflaZrMZ/0U+Cc1ab+XviCKr6ghKX9eIMhcaVnFBVDa6uEinX+m2wi7zHEHl0\nVZsXnzyAEfua9P9DmynzPg==\n-----END PRIVATE KEY-----\n",
        client_email:
          "firebase-adminsdk-mq6hy@gdsc-solution-challenge-4245d.iam.gserviceaccount.com",
        client_id: "102286811048450322098",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url:
          "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url:
          "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-mq6hy%40gdsc-solution-challenge-4245d.iam.gserviceaccount.com",
        universe_domain: "googleapis.com",
      }),
    },
    "firebase-admin-app"
  );
export const auth = getAuth(firebaseApp);

export async function isUserAuthenticated(session) {
  const _session = session ?? (await getSession());
  if (!_session) return false;

  try {
    const isRevoked = !(await auth.verifySessionCookie(_session, true));
    return !isRevoked;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!(await isUserAuthenticated(session))) {
    return null;
  }

  const decodedIdToken = await auth.verifySessionCookie(session);
  const currentUser = await auth.getUser(decodedIdToken.uid);

  return currentUser;
}

async function getSession() {
  try {
    return cookies().get("__session")?.value;
  } catch (error) {
    return undefined;
  }
}

export async function createSessionCookie(idToken, sessionCookieOptions) {
  return auth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session) {
  const decodedIdToken = await auth.verifySessionCookie(session);

  return await auth.revokeRefreshTokens(decodedIdToken.sub);
}

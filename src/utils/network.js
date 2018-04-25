import { SERVER_URL } from '../constants/globalConstants';

export default function isServerAvailable(url = SERVER_URL) {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(reject, 300, 'Request timed out');
  });

  const request = fetch(url);

  return Promise.race([timeout, request]);
}

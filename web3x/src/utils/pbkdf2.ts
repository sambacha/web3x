/*
  This file is part of web3x.

  web3x is free software: you can redistribute it and/or modify
  it under the terms of the GNU Lesser General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  web3x is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License
  along with web3x.  If not, see <http://www.gnu.org/licenses/>.
*/

import pbkdf2Lib from 'pbkdf2';

export async function pbkdf2(
  password: Buffer,
  salt: Buffer,
  iterations: number,
  dklen: number,
): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    pbkdf2Lib.pbkdf2(
      password,
      salt,
      iterations,
      dklen,
      'sha256',
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  });
}

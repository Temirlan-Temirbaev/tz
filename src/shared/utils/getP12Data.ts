import * as forge  from 'node-forge';

// type getP12DataResponse = {
//   privateKey: {
//     sign:  (msg: MessageDigest) => void;
//   },
//   subject: {
//     attributes: CertificateField[],
//     hash: string;
//   }
// }

export const getP12Data = async (file: Express.Multer.File, password: string) => {

  try {
    const p12Buffer = file.buffer;
    const p12Asn1 = forge.asn1.fromDer(p12Buffer.toString('binary'));
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);

    // Extract certificate
    const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });
    const certificate = certBags[forge.pki.oids.certBag][0].cert;
    const { subject } = certificate;

    let privateKey;
    let privateKeyFound = false;

    // Extract private key
    p12.safeContents.forEach(safeContent => {
      safeContent.safeBags.forEach(safeBag => {
        if (safeBag.key) {
          privateKey = safeBag.key;
          privateKeyFound = true;
        }
      });
    });


    // transform subject fields to utf-8
    subject.attributes.forEach(attr => {
      if (typeof attr.value === 'string') {
        attr.value = Buffer.from(attr.value, 'binary').toString('utf8');
      }
    });

    if (!privateKeyFound) {
      throw new Error('Private key not found in P12 file');
    }

    return { privateKey, subject };
  } catch (err) {
    console.error(err);
  }
}
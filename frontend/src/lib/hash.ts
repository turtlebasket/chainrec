import sjcl from "sjcl";

function hashFileData(data: string): string {
    const bitRes = sjcl.hash.sha256.hash(data);
    return sjcl.codec.hex.fromBits(bitRes);
}

export default hashFileData
# Authentication-Project
From the London App Brewery, I documented 6 methods of authentication and have my sample users persisted in a mongodb for reference


these are the 6 users created as samples in my DB:

***************************** Simple authentication via username and password stored as text
{
  "_id": {
    "$oid": "5ebd91e45b6b78436cf01b95"
  },
  "email": "test@level1.com",
  "password": "123456",
  "__v": "0"
}

*********************** Slightly more secure method of data storage via mongoose-encrypt
{
  "_id": {
    "$oid": "5ebd956a4d69d9057c09f348"
  },
  "email": "test@level2.com",
  "_ct": {
    "$binary": {
      "base64": "YRGvPNuTeyEHE3i0kRMBpCsb/a5DJ+J5/lwI568SoN0ymVIihpAuSTS9AEgS3CcQYg==",
      "subType": "00"
    }
  },
  "_ac": {
    "$binary": {
      "base64": "YYcTo85xuAr1OEMUZ0sm41wXga6+1YQWwbCVbR0hgtcVWyJfaWQiLCJfY3QiXQ==",
      "subType": "00"
    }
  },
  "__v": "0"
}

*************************Slightly-er more secure method of data storage via MD5 hashing
{
  "_id": {
    "$oid": "5ebd9ad9265fa76e1090d746"
  },
  "email": "test@level3.com",
  "password": "e10adc3949ba59abbe56e057f20f883e",
  "__v": "0"
}

************************* A secure method of data storage via bcrypt
{
  "_id": {
    "$oid": "5ebdc0ff69e2a10b6d4b4864"
  },
  "email": "test@level4.com",
  "password": "$2b$10$3qdaOY2CPAXpPjTbIZwpgeZRN1Ha3V7CPiorkx/bEnhg4EaKkRGqe",
  "__v": "0"
}

*************************** A more secure method of data storage via passport-local-mongoose
{
  "_id": {
    "$oid": "5ebdd5860df4d159a184d5d3"
  },
  "username": "test@level5.com",
  "salt": "6caf42bf63ec1e585824eebcfe58ae279780e17691c2ab0f46c7553a59ad9fd6",
  "hash": "94d31db44b247c10805b7abe3b852bd2722585551b8ea594b3305be0afee11d6d2f1b51d62147ea25488ea10ecc5be7da13fd811304f063661a5c8e50aa417480bb7eaac587858372fb7f85c10106e0797b58245a5ecec11fe1e5b535b28a305f9b74d47c889d404083d1a1dc0d87b63f12d82f348c2f407cd03750c33cb0be4bbe7eced6c4360ebfb64dfdd66afd13c458b8da3f2e3ef8b731d1ed17bb2578c2c3f0f991f2c8fd183654f1cba80907c3b2d420e014e7e00110484cd011eb803a792896910039872416db7f9528a16b56027adb51881628b064ef71b9d820d8b678668fc6f570e19ddb8c030a9df6b047e10dcace1691b3d2f9cff531dfa4cad6a2bad901ffdda56cd375d43840e97d7dacb26424f893385649a573538581571261b66eeaa5c57effbc496206566e6a5c98ea5b8230ce488f8861d008424288d4c92a0579ec716a1e415d5afab700474c9129da2270afe1fa004d1896fe68d89ee7fcb7a003639d43d39d79e1ab906bb78b91a2ff249ef11372cb0c5782476e894b92908214bc73e1586a09f2ff172aa329dc58e352a4406bcacc167a74713de85f71a77b1762b98431aeaa4e186e7b1b45aad0f020b86b67fa954b377a48527036b36f79e19f81dda5681e7b7c241ecc6bff3290d41291241703eb5a7c16c41357ad2451cd9f6b729a4496a2e020cbd96d27e37b6766245c414e502f7f38463",
  "__v": "0"
}

************************* The big brain method of shifting liability for data privacy to tech giants via OAuth2.0
{
  "_id": {
    "$oid": "5ebdef16ab8996bd15e88077"
  },
  "googleId": "110741385950087070777",
  "__v": "0",
  "secret": "I'm an aspiring vegetarian."
}

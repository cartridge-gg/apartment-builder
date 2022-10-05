## Dapps

Dapps are identified by NFTs. They are associated with pre-minted NFT that
complies to the ERC-721 standard and contains the following attributes:

- `name` is the name of the Dapps
- `description` is a short description to help identifie the dapp
- `external_url` is the URL of the Dapp
- `image` is a link to a logo of the Dapp
- `attributes` consists in a number of values, including:
  - the application `dapp_type` that can be `thirdparty` or `internal`
  - the application `instance` that is a number and 0 by default. It helps to
    identify a specific instance of a dapp if necessary

Below is an exemple of a Dapp.

```json
{
  "name": "Frens Lands",
  "description": "Frens Lands can be accessed at https://frenslands.xyz", 
  "external_url": "https://frenslands.xyz", 
  "image": "https://apartmentbuilder.carnage.sh/frenslands.png", 
  "attributes": [
    { 
      "tray_type": "dapp_type",
      "value": "thirdparty"
    }
    {
      "display_type": "number",
      "tray_type": "instance",
      "value": ${instance}
    }
  ] 
}
```

### Contract

Minting and transfering those ERC-721 token are done via a owner account by the
project team for now. The TokenID is a Pedersen Hash of the JSON file

### API

The API associated with the contract is the following:

| route           | verb | description           |
| --------------- | ---- | --------------------- |
| /dapps/:tokenID | GET  | describe a given dapp |


### Questions

Can we have a number of example of dapps we can register?
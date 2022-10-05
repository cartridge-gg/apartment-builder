## File Sets

`File Sets` are building blocks for appartments

### A FileSet

A File Set is described like below:

```json
{
  "name": "Friendly Name",
  "description": "Friendly Description", 
  "external_url": "https://apartmentbuilder.carnage.sh/fileset01.png", 
  "image": "https://apartmentbuilder.carnage.sh/fileset01.png", 
  "attributes": [
    {
      "tray_type": "dapp",
      "value": `${dappTokenID}`
    },
    { 
      "tray_type": "hash", 
      "value": "`${hash}`"
    }
  ]
}
```

### Contract

Minting and transfering those ERC-721 token are done via a owner account by the
project team for now. The tokenID is a Pedersen Hash of the JSON file. Attached
to it, it has a number of object which description is available below and that
are identified by numbers. The FileSet contains a merkle root of the list of
objects. Noticeable methods are the following:

- `tokenID` provides checks the hash of the fileset exists and returns
  the dapp associated with it
- `root` provides the merkle root of the objects
- `updateRoot` allows to update the merkle root of the fileset objects.

### Objects

An object is linked to a fileset. It contains the following properties:

- `name` is the object friendly name
- `id` is the identifier of the object (rank) to build the merkle tree
- `size` defines the object size (x and y)
- `position` defines the location of the 1st frame of the object (x and y) in
  the fileset
- `animation` is defined only for animated object, It defines the frames
  of each object as well as the delay before the next frame.
- `ownership` defines how the object is owned. It can be `erc721`, `erc1155` or `shared`
- `contract` defines the contract address for `erc721` and `erc1155` ownership.

Below is an example of an object:

```json
{
  "name": "cactus",
  "id": 1,
  "fileset": "${filesetID}",
  "size": {
    "x": 1,
    "y": 1,
    "z": 1,
  },
  "position": {
    "x": 3,
    "y": 1
  },
  "animation": [
    {"x": 3, "y": 1, "delay_ms": 200},
    {"x": 5, "y": 1, "delay_ms": 200},
    {"x": 7, "y": 1, "delay_ms": 200}
  ],
  "ownership": "erc-721",
  "contract": "0xdeadbeaf"
}
```

### API

| route                                  | verb | description                 |
| -------------------------------------- | ---- | --------------------------- |
| /filesets/:filesetID                   | GET  | describe a given fileset    |
| /filesets/:filesetID/objects           | GET  | list the objects associated |
|                                        |      | with the fileset            |
| /filesets/:filesetID/objects/:objectID | GET  | describe an objects         |

### Questions

Can we have a number a FileSet with some object to start them.

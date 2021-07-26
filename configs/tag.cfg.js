
const ENDPOINTS = {
  all: `Call GTT_Tag();`,
  findByID: (id) =>  `Call GTR_Tag_By_ID(${id});`,
  findByName: (name) =>  `Call GTR_Tag_By_Name('${name}');`,
  add: (name) => `Call INS_Tag('${name}');`,
  update: (tag) => `Call UPD_Tag_By_ID(${tag.ID}, '${tag.Name}');`,
  delete: (id) => `Call DEL_Cascade_Post(${id});`,
}
module.exports = {
  ENDPOINTS,
};
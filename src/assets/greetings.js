const menition = member => `<@${member.id}>`;

const greetingsList = [
  member => `Salve, ${menition(member)}!`,
  member => `Occultantes dolorem Classicistae tibi, ${menition(member)}, salutem damus!`,
  member => `Te, o ${menition(member)}, salutamus!`,
]

module.exports = greetingsList;

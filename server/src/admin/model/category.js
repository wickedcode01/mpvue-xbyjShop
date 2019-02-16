module.exports = class extends think.Model {
  getbriefInfo() {
    return this.field('name,front_name,id').select();
  }
}

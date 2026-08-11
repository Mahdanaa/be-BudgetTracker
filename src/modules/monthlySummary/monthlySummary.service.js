const { MonthlySummary } = require('../../../models');
const NotFound = require('../../errors/NotFoundError');

class MonthlySummaryService {
  async getAll() {
    return await MonthlySummary.findAll();
  }
  async getById(id) {
    const summary = await MonthlySummary.findByPk(id);
    if (!summary) throw new NotFound('Summary bulanan tidak ditemukan');
    return summary;
  }
  async create(data) {
    return await MonthlySummary.create(data);
  }
  async update(id, data) {
    const summary = await MonthlySummary.findByPk(id);
    if (!summary) throw new NotFound('Summary tidak di temukan');
    await summary.update(data);
    return summary;
  }
  async delete(id) {
    const summary = await MonthlySummary.findByPk(id);
    if (!summary) throw new NotFound('Summary tidak ditemukan');
    await summary.destroy();
    return true;
  }
}

module.exports = new MonthlySummaryService();

/* eslint-disable */
import Csv from './_csv'
import ExportCsv from './_export-csv'
import FileSaver from 'file-saver'
import * as Excel from './_export2Excel'

const vueTableExport = {
  csv(params) {
    return new Promise((resolve, reject) => {
      // 默认值
      const paramsDefault = {
        columns: [],
        replace: {},
        data: [],
        title: 'table',
        noHeader: false
      };

      // 合并参数
      const _params = Object.assign({}, paramsDefault, params);
      // 生成数据
      const data = Csv(_params.columns, _params.data, params, _params.noHeader);
      // 下载数据
      ExportCsv.download(_params.title, data);

      // 完成
      resolve()
    })
  },
  excel(params) {
    return new Promise((resolve, reject) => {
      // 默认值
      const paramsDefault = {
        columns: [],
        data: [],
        title: 'table',
        header: null,
        merges: []
      };

      // 合并参数
      const _params = Object.assign({}, paramsDefault, params);
      // 从参数中派生数据
      const header = _params.columns.map(e => e.label);
      try {
        _params.columns.forEach(function (val, key) {
          if (_params.data[0][val.prop] === undefined) {
            throw new Error(val.prop + '不存在')// 跳出循环
          }
        })
      } catch (e) {
        console.error(e)
        return false
      }
      const data = _params.data.map(row => _params.columns.map(col => row[col.prop]));
      // 处理特殊总计数据
      data.forEach(function (v, k) {
        v.forEach(function (vv, kk) {
          if (vv === undefined) {
            data[k] = _params.data[k]
          }
        })
      })
      // 导出
      Excel.export_json_to_excel(header, data, _params.title, {
        merges: _params.merges,
        header: _params.header
      }, _params.ws_name);

      // 完成
      resolve()
    })
  },
  txt(params) {
    return new Promise((resolve, reject) => {
      // 默认值
      const paramsDefault = {
        text: '',
        title: '文本'
      };

      // 合并参数
      const _params = Object.assign({}, paramsDefault, params);
      // 导出
      const blob = new Blob([_params.text], {type: 'text/plain;charset=utf-8'});
      FileSaver.saveAs(blob, _params.title + '.txt');

      // 完成
      resolve()
    })
  }
};

export default vueTableExport

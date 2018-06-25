/**
 * Automatize the grid reporting
 *
 * <PaginatedGrid grid={grid} display={display} onPageChange={onPageChange} />
 *
 * reference
 *  grid = {
 *    page: (integer),
 *    pageSize: (integer),
 *    total: (integer),
 *    items: [array of objects],
 *  }
 *  display = {
 *    id: 'Codigo',
 *    description: {header: 'Descripción', render: callback(row){ return ...}}
 *  }
 *  onPageChange = function(){...}
 *  labelLoading = (string) "Cargando datos..."
 *  labelNoData  = (string) "No hay datos"
 *  labelButtons = {object} check LABEL_BUTTONS
 */
import { isArray, isFunction, isString, isObject, isEmpty, has, size } from 'lodash'
import React, { Component } from 'react'
// material
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell
} from '@material-ui/core/'
// pagination
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

// default label for buttons
const LABEL_BUTTONS = {
  prev_page: "Página anterior",
  next_page: "Página siguiente",
  prev_5: "5 páginas previas",
  next_5: "5 páginas siguientes",
  prev_3: "3 páginas previas",
  next_3: "3 páginas siguientes"
}

const defaultPageSize = 10;

class PaginatedGrid extends Component {

  constructor(){
    super();
    // default configuration
    this.labelLoading = "Loading data...";
    this.labelNoData  = "No data available";
    this.labelButtons = LABEL_BUTTONS;
    this.pageSize = defaultPageSize;
    this.total = 0;
    this.items = [];
    this.state = {
      page: 1,
    }
    this.onChangePage = this.onChangePage.bind(this);
  }

  /*
   * Change default configuration & initialize grid settings
   */
  componentWillReceiveProps(nextProps){
    let { grid, labelLoading, labelNoData, labelButtons } = nextProps;
    // init label vars
    if(!isEmpty(labelLoading)){
      this.labelLoading = labelLoading;
    }
    if(!isEmpty(labelNoData)){
      this.labelNoData = labelNoData;
    }
    if(!isEmpty(labelButtons)){
      this.labelButtons = Object.assign({}, LABEL_BUTTONS, labelButtons);
    }
    // parse table vars
    let {page, pageSize, total, items=[]} = grid;
    if (isArray(items)){
      this.items = items;
    }
    if(total===undefined){
      this.total = parseInt(items.length, 10);
    } else if (parseInt(total, 10)>0) {
      this.total = parseInt(total, 10);
    }
    if (parseInt(pageSize, 10)>0) {
      this.pageSize = parseInt(pageSize, 10);
    }
    if (parseInt(page, 10)>0) {
      this.setState({page: parseInt(page, 10)})
    }
    // bugfix
    if(this.items.length === 0 && this.total>0){
      this.onChangePage(1);
      return;
    }
  }

  /*
   * Return records for single page
   */
  getPageRows(){
    // local pagination?
    if(this.items.length>this.pageSize){
      // pages logically start with 1, but technically with 0
      let from = (this.state.page - 1) * this.pageSize;
      let to = (this.state.page) * this.pageSize;
      return this.items.slice(from, to);
    }
    // server pagination
    return this.items;
  }

  /*
   * Run on every page change event
   */
  onChangePage(page){
    if(has(this.props,'onPageChange') && isFunction(this.props.onPageChange)){
      this.props.onPageChange(page);
      return;
    }
    if(this.items.length>this.pageSize){
      this.setState({page: page});
    }
  }

  renderPaginator() {
    // validations
    if(this.items.length === 0) return null;
    if(this.total <= 0) return null;
    if(this.total < this.pageSize) return null;
    let page = this.state.page;
    // populate vars
    let to = page * this.pageSize;
    let from = to - this.pageSize + 1;
    if (to > this.total) to = this.total;
    // done render pager
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <Pagination
          className="ant-pagination"
          onChange={this.onChangePage}
          current={page}
          locale={this.labelButtons}
          showTotal={total => `${from} - ${to} de ${this.total} registros`}
          total={this.total}
          pageSize={this.pageSize}
        />
      </div>
    );
  }

  renderBlank(mensaje) {
    const colspan = size(this.props.display);
    return (
      <TableRow key={1}>
        <TableCell colSpan={colspan}><p>{mensaje}</p></TableCell>
      </TableRow>
    )
  }

  renderTableBody(rows) {
    const context = this;
    if(rows.length === 0){
      return this.renderBlank(this.labelNoData);
    }
    // row loop
    return rows.map( (row, index) => {
      let arrData = [], c=0;
      // columns loop
      for(let key in this.props.display){
        try{
          let display = this.props.display[key];
          if( isString(display)){
            arrData.push(<TableCell key={c++}>{row[key]}</TableCell>)
          }
          if(isObject(display) && has(display,'render') && isFunction(display['render'])){
            arrData.push(<TableCell key={c++}>{display.render(row, context)}</TableCell>)
          }
        }catch(error){
          arrData.push(<TableCell key={c++}>error</TableCell>)
          console.log(`<PaginatedGrid> Error en el campo ${key}.`, error.toString(), row);
        }
      }
      // done with this single row...
      return (<TableRow key={index} style={{ height: '16px', fontSize: '12px' }}>{arrData}</TableRow>)
    })
  }

  renderTableHeaders(display){
    let arrHeaders = [];
    for(let i in display){
      if( isString(display[i])){
        arrHeaders.push(<TableCell key={i}>{display[i]}</TableCell>)
      } else if( isObject(display[i]) && has(display[i], 'header')) {
        arrHeaders.push(<TableCell key={i}>{display[i]['header']}</TableCell>)
      }
    }
    return(<TableRow>{arrHeaders}</TableRow>);
  }

  render() {
    // init vars
    let contenido, header, paginator, rows;
    let { grid, display } = this.props;
    header = this.renderTableHeaders(display);
		if(grid.isLoading){
			contenido = this.renderBlank(this.labelLoading);
		} else {
      rows = this.getPageRows();
			contenido = this.renderTableBody(rows);
      paginator = this.renderPaginator();
		}
    // done, render all
    return (
      <div className="table-responsive">
        <Table>
          <TableHead>
              {header}
          </TableHead>
          <TableBody style={{paddingLeft: 500}}>
  					   {contenido}
  				</TableBody>
        </Table>
        {paginator}
      </div>
    )
  }

}

export default PaginatedGrid

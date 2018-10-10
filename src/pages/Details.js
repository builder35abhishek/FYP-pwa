import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import {StockDetails, StockPriceChart, StockTimeFrame, StockModelList, StockGrade} from '../components/stock';
import {getStock, getStockPrices, getPredictions} from '../actions/stock';
import moment from 'moment';

const mapStateToProps = (state, ownProps) => ({
  stock: state.get('stock').get('stockDetails'),
  stockPrices: state.get('stock').get('stockPrices').get(ownProps.match.params.stockCode, null),
  predictions: state.getIn(['stock', 'predictions', ownProps.match.params.stockCode], null),
  models: state.getIn(['stock', 'models', ownProps.match.params.stockCode], null),
  grade: state.getIn(['stock', 'grade', ownProps.match.params.stockCode], null)
});

const mapDispatchToProps = (dispatch) => ({
  getStock: (stockCode) => dispatch(getStock(stockCode)),
  getStockPrices: (stockCode) => dispatch(getStockPrices(stockCode)),
  getPredictions: (stockCode) => dispatch(getPredictions(stockCode))
});

const styles = () => ({
  stockPriceChart: {
    width: '100%'
  },
  stockModelList: {
    width: '100%'
  },
  stockGrade: {
    width: '100%'
  }
});

class DetailsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {timeInterval: moment().subtract(3, 'months').toDate()};
  }

  onTimeFrameClick = (timeFrameStr) => {
    const {prices, predictions, models} = this.props;
    
    let timeInterval = moment();

    switch(timeFrameStr) {
      case "1w":
        timeInterval = timeInterval.subtract(7, 'days');
        break;
      case "1m":
        timeInterval = timeInterval.subtract(1, 'months');
        break;
      case "3m":
        timeInterval = timeInterval.subtract(3, 'months');
        break;
      case "6m":
        timeInterval = timeInterval.subtract(6, 'months');
        break;
      case "1y":
        timeInterval = timeInterval.subtract(1, 'years');
        break;
      case "2y":
        timeInterval = timeInterval.subtract(2, 'years');
        break;
      default:
        timeInterval = timeInterval.subtract(5, 'years');
    }
    this.setState({timeInterval: timeInterval.toDate()});
    console.log(this.state)
  } 
  
  componentDidMount() {
    this.props.setLoading(true);
    Promise.all([
      this.props.getStock(this.props.match.params.stockCode),
      this.props.getStockPrices(this.props.match.params.stockCode),
      this.props.getPredictions(this.props.match.params.stockCode)
    ])
    .then(() => {
      this.props.setLoading(false);
    });
  }

  render() {
    const {stock, stockPrices, predictions, models, grade, classes} = this.props;

    return (
      <div>
        <StockDetails stock={stock} />
        {
          stockPrices &&
          <div>
            <StockPriceChart
              prices={stockPrices}
              predictions={predictions}
              models={models}
              timeInterval={this.state.timeInterval}
              className={classes.stockPriceChart} />
            <StockTimeFrame
              onTimeFrameClick={this.onTimeFrameClick} />
          </div>
        }
        {
          grade &&
          <StockGrade
            grade={grade}
            className={classes.stockGrade} />
        }
        {
          models &&
          <StockModelList
            models={models}
            className={classes.stockModelList} />
        }
      </div>
    );
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DetailsPage));

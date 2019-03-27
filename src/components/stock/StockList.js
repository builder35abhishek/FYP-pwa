import React, {Component} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import immutableToJsComponent from '../immutableToJsComponent';

class StockList extends Component {
  constructor(props) {
	super(props);
	this.state = { hovered: null };
  }

  render() {
    const {stocks, onStockClick, onAddFavouriteStock, isFavourite} = this.props;

    return (
      <List>
        {stocks.map((stock) =>
          <ListItem key={stock.code} button onClick={() => onStockClick(stock.code)}>
            <ListItemText primary={stock.name} />
			<ListItemSecondaryAction>
			  <IconButton
			    onMouseEnter={() => this.setState({hovered: stock.code})}
			    onMouseLeave={() => this.setState({hovered: null})}
			    onClick={() => onAddFavouriteStock(stock.code)}
			  >
			    {
				  this.state.hovered === stock.code 
					? (isFavourite ? <FavoriteBorder /> : <Favorite />)
					: (isFavourite ? <Favorite /> : <FavoriteBorder />)
				}
			  </IconButton>
			</ListItemSecondaryAction>
          </ListItem>
        )}
      </List>
    );
  }
}

export default immutableToJsComponent(StockList);

import { Component } from 'react';
import { Provider, connect, } from 'react-redux'
import { combineReducers, createStore } from 'redux';
import './quote.scss'

const LOADING = "LOADING";
const LOADING_FIN = "LOADING_FIN";
const RANDOM_QUOTE = "RANDOM_QUOTE";

const QUOTES_URL =
	"https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json";

class RandomQuote extends Component {
	quotes = [];

	sendRandomQuoteInfo() {
		if (!this.quotes.length) return "";
		const randomIndex = Math.floor(Math.random() * this.quotes.length);
		const quote = this.quotes[randomIndex];
		quote && this.props.randomQuote(quote);
	}

	componentDidMount() {
		this.props.startLoading();
		fetch(QUOTES_URL)
			.then((res) => {
				return res.json();
			})
			.then(
				(result) => {
					if (result && result.quotes.length) {
						this.quotes = result.quotes;
						this.sendRandomQuoteInfo();
					}
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			)
			.finally(() => {
				this.props.endLoading();
			});
	}
	didClickNewQuote = () => {
		this.sendRandomQuoteInfo();
	};

	render() {
		const { quote, author, isLoading } = this.props;
		const tweetHref =
			"https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=" +
			encodeURIComponent('"' + quote + '" ' + author);
		return (
			<div id='app'>
				<div id="quote-box">
					{isLoading && <p>loading...</p>}
					{!isLoading && (
						<div>
							<div id="text">
								<i class="fa fa-quote-left" /> {quote}{" "}
								<i class="fa fa-quote-right" />
							</div>
							<div class="quote-author">
								<span id="author">- {author}</span>
							</div>
							<div class="action-btns">
								<button
									id="new-quote"
									class="button"
									onClick={this.didClickNewQuote}
								>
									New quote
								</button>
								<a
									id="tweet-quote"
									class="button tweet"
									target="_top"
									href={tweetHref}
								>
									<i class="fa fa-twitter" />
								</a>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	}
}

const loading = () => {
	return {
		type: LOADING
	};
};

const loadingFin = () => {
	return {
		type: LOADING_FIN
	};
};

const randomQuote = (quoteInfo) => {
	return {
		type: RANDOM_QUOTE,
		quote: { quote: quoteInfo.quote || "", author: quoteInfo.author || "" },
	}
}

const loadingReducer = (state = false, action) => {
	switch (action.type) {
		case LOADING:
			return true;
		case LOADING_FIN:
			return false;
		default:
			return state;
	}
};

const randomQuoteReducer = (state = { quote: "", author: "" }, action) => {
	switch (action.type) {
		case RANDOM_QUOTE:
			return action.quote;
		default:
			return state;
	}
}

const rootReducer = combineReducers({ isLoading: loadingReducer, quoteInfo: randomQuoteReducer });
const quoteStore = createStore(rootReducer);

const mapQuoteStateToProps = (state) => {
	return {
		isLoading: state.isLoading,
		quote: state.quoteInfo.quote,
		author: state.quoteInfo.author,
	};
};

const mapQuotesDispatchToProps = (dispatch) => {
	return {
		startLoading: () => {
			dispatch(loading());
		},
		endLoading: () => {
			dispatch(loadingFin());
		},
		randomQuote: (quoteInfo) => {
			dispatch(randomQuote(quoteInfo));
		}
	};
};

const QuotesContainer = connect(
	mapQuoteStateToProps,
	mapQuotesDispatchToProps
)(RandomQuote);

class AppWrapper extends Component {
	render() {
		return (
			<Provider store={quoteStore}>
				<QuotesContainer />
			</Provider>
		);
	}
}

export default AppWrapper


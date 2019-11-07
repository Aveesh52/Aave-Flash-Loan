import React, { Component } from 'react';
import logo from '../logo.png';
import Web3 from 'web3';
import MockFlashLoanReceiver from '../abis/MockFlashLoanReceiver.json'
import {main}  from 'ethereum-dex-prices-service';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
  this.state = {
     account: '',
     results: [],
     reserves: []
  }
}

//Would be using this code which is just fetching the list of reserves once we have the ui
// till then just hardcoded the data.

  // async componentDidMount() {
  //   fetch(`https://dlp-api-dev.testing.aave.com/data/reserves`)
  //   .then(res => console.log(res.json()))
  //   // .then(result => console.log(result))
  //   // console.log(this.state.reserves);

  // }

  async componentWillMount() {
    await this.loadWeb3();
    await this.getDexPrices();
   await this.loadBlockchainData();
  }

  async getDexPrices() {
    const results = await main('DAI', 500, 'BUY')
    this.setState({results})
    console.log(this.state.results[0])
  }
  
  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if(window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert("Create your Metmask Wallet");
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    const account = await web3.eth.getAccounts();
    const id = await web3.eth.net.getId();
    this.setState({account: account[0]})
    const abi = MockFlashLoanReceiver.abi;
    const networkData = MockFlashLoanReceiver.networks[id];
    console.log(id)
    console.log(networkData.address)
    if (networkData) {
    const FlashLoan = web3.eth.Contract(abi, networkData.address);
    this.setState({FlashLoan});
    FlashLoan.methods.executeOperation("0xd2eC3a70EF3275459f5c7a1d5930E9024bA3c4f3", 3, 2).send({ from: this.state.account })
    .once('reciept', reciept => {
      console.log(reciept);
     })
     }  else {
        alert("No Contract Deployed!!")
    }
 }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

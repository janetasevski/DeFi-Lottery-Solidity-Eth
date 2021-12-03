import { useEffect, useState } from "react";
import web3 from "./Web3/web3";
import LotteryContract from "./Web3/lottery-contract";
import "./App.css";

function App() {
  const [userAccount, setUserAccount] = useState("");
  const [manager, setManager] = useState("");
  const [balance, setBalance] = useState(0);
  const [players, setPlayers] = useState([]);
  const [stake, setStake] = useState("0.0001");
  const [message, setMessage] = useState("");
  const adminFormShow = manager === userAccount;

  const getUserAccount = async () => {
    const accounts = await web3.eth.getAccounts();
    setUserAccount(accounts[0]);
  };

  const getData = async () => {
    const retrivedManager = await LotteryContract.methods.manager().call();
    setManager(retrivedManager);
    const retrivedBalance = await LotteryContract.methods.getBalance().call();
    setBalance(retrivedBalance);
    const retrivedPlayers = await LotteryContract.methods.getPlayers().call();
    setPlayers(retrivedPlayers);
  };
  
  useEffect(() => {
    getUserAccount();
    getData();
  }, []);

  const onSubmitForm = async (event) => {
    event.preventDefault();

    setMessage("Waiting on transaction success...");
    await LotteryContract.methods.enter().send({
      from: userAccount,
      value: web3.utils.toWei(stake, "ether"),
    });
    setMessage("You have been entered!");
    getData();
  };

  const pickWinner = async () => {
    setMessage("Waiting to choise a winer...");
    await LotteryContract.methods.pickWinner().send({
      from: userAccount,
    });
    setMessage("A Winner has been picked!");
    getData();
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>Lottery</h2>
        <p>Managed by: {manager}</p>
        <p>Balance: {balance && web3.utils.fromWei(balance, "ether")} ETH</p>
        <p>Players: </p>
        {players.map((player) => (
          <div key={player}>{player}</div>
        ))}
        <form onSubmit={onSubmitForm}>
          <h4>Add your stack!</h4>
          <div>
            <label style={{ marginRight: 10 }}>Amount</label>
            <input
              type="number"
              value={stake}
              onChange={(event) => setStake(event.target.value)}
            />
            <button>Enter</button>
          </div>
          <h1>{message}</h1>
        </form>
        {adminFormShow && (
          <div>
            <h4>Admin Part</h4>
            <button onClick={pickWinner}>Pick a winner!</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;

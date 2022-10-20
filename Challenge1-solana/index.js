const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

// Create a new pair
const newPair = new Keypair();

// Exact public and private key from keypair
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const privateKey = newPair._keypair.secretKey;

// connect to devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log("Public key of the generated keypair", publicKey);

// Get the wallet balance from a given private key
const getWalletBalance = async () => {
  try {
    // connect to the devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    console.log("Connection object is:", connection);

    // Make a wallet(keypair) from privatekey and get its balance
    const myWallet = await Keypair.fromSecretKey(privateKey);
    const walletBalance = await connection.getBalance(
      new PublicKey(myWallet.publicKey)
    );
    console.log(
      `Wallet Balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SQL`
    );
  } catch (error) {
    console.log(error);
  }
};

const airDropSOL = async () => {
  try {
    // connect to the devnet and make a wallet from a privateKey
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const myWallet = await Keypair.fromSecretKey(privateKey);

    console.log(myWallet.publicKey);

    // request airdrop of 2 SOL to the wallet
    console.log("Airdropping some SOL to my wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
      // user public key insted of myWallet.publicKey
      new PublicKey(process.argv[2]),
      2 * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(fromAirDropSignature);
  } catch (error) {
    console.log(error);
  }
};

// Show the wallet balance before and after airdrop SOL
const mainFunction = async () => {
  await getWalletBalance();
  await airDropSOL();
  await getWalletBalance();
};

mainFunction();

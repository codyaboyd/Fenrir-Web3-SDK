async function metamaskAuthSpecific(id,rpc) {
	 if (window.ethereum) {
      try {
        // check if the chain to connect to is installed
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: id }], // chainId must be in hexadecimal numbers
        });
		metamaskAuth();
      } catch (error) {
        // This error code indicates that the chain has not been added to MetaMask
        // if it is not, then install it into the user MetaMask
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: id,
                  rpcUrl: rpc,
                },
              ],
            });
			window.reload();
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);
      }
    } else {
      // if no window.ethereum then MetaMask is not installed
      alert('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
	  window.reload();
    }
}

async function metamaskAuth() {
    console.log('Connecting to wallet...')
    try {
        var accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts.length == 0) {
            console.log('Please connect to MetaMask.');
            $('#enableMetamask').html('Connect Metamask')
        } else if (accounts[0] !== currentAddr) {
            currentAddr = accounts[0];
            if (currentAddr !== null) {
                console.log('Wallet connected = ' + currentAddr)
            }
        }
    } catch (err) {
        if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            alert('Please connect to MetaMask.');
        } else {
            console.error(err);
        }
    }
}
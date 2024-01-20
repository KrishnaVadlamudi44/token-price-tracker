import React, { useCallback, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import {
  NetworksData,
  NetworksResponse,
  TokenData,
  TokenResponse,
} from './types';

const baseUrl = 'https://api.geckoterminal.com/api/v2';

function App() {
  const fetchNetworks = useCallback(async () => {
    const networks = await GetNetworks();
    console.log(networks);
  }, []);

  const fetchTokenData = useCallback(async () => {
    const tokensData = GetCoinPrice('test', 'test');
    console.log(tokensData);
  }, []);

  useEffect(() => {
    // fetchNetworks();
    // fetchTokenData();
  }, [fetchNetworks, fetchTokenData]);

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'>
          Learn React
        </a>
      </header>
    </div>
  );
}

const GetNetworks = async (
  networks: NetworksData[] = [],
  link?: string
): Promise<NetworksData[]> => {
  const res: NetworksResponse = (await (
    await fetch(link ?? `${baseUrl}/networks`)
  ).json()) as NetworksResponse;

  networks = networks.concat(...res.data);

  if (res.links.next) {
    return GetNetworks(networks, res.links.next);
  }

  return networks;
};

const GetCoinPrice = async (
  network: string,
  addresses: string
): Promise<TokenData[]> => {
  const res: TokenResponse = await (
    await fetch(`${baseUrl}/networks/${network}/tokens/multi/${addresses}`)
  ).json();

  return res.data;
};

export default App;

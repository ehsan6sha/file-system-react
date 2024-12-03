import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { HDKEY } from '@functionland/fula-sec-web';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { createConfig, getAccount, signMessage } from '@wagmi/core';
import { mainnet, arbitrum } from 'viem/chains';
import { metaMask } from '@wagmi/connectors';
import { http, keccak256  } from 'viem';

const projectId = '94a4ca39db88ee0be8f6df95fdfb560a';
const metadata = {
  name: 'WNFS Setup',
  description: 'Setup WNFS identity',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

interface WNFSSetupProps {
  onKeyGenerated: (key: Uint8Array, rootCid?: Uint8Array) => void;
}

const WNFSSetup: React.FC<WNFSSetupProps> = ({ onKeyGenerated }) => {
  const [password, setPassword] = useState('');
  const [rootCid, setRootCid] = useState('');
  const [isUnderstandChecked, setIsUnderstandChecked] = useState(false);
  const [isMetamaskChecked, setIsMetamaskChecked] = useState(false);
  const [linking, setLinking] = useState(false);
  
  useEffect(() => {
    const chains = [mainnet, arbitrum];
    const config = defaultWagmiConfig({
      chains,
      projectId,
      metadata,
      connectors: [metaMask({ chains })],
      transports: {
        [mainnet.id]: http(),
        [arbitrum.id]: http(),
      },
    });
  
    const modal = createWeb3Modal({
      wagmiConfig: config,
      projectId,
      enableAnalytics: true,
    });
  
    const currentPassword = password;
  
    modal.subscribeEvents(event => {
      console.log(event.data.event);
      const state = event?.data?.event;
      if (state === "CONNECT_SUCCESS") {
        console.log('connected to wallet');
        const account = getAccount(config);
        const address = account?.address;
        console.log('logged in with address: ' + address);
        if (address) {
          handleLinkPassword(config, currentPassword);
        }
      }
    });
  
    (window as any).web3Modal = modal;
  }, [password]);
  
  const handleLinkPassword = async (config: any, currentPassword: string) => {
    try {
      if (linking) return;
      setLinking(true);
  
      const ed = new HDKEY(currentPassword);
      const chainCode = ed.chainCode;
      const msg = `Sign this message to link your wallet with the chain code: ${chainCode}`;
  
      const signature = await signMessage(config, { message: msg });
      if (!signature) {
        throw new Error('Sign failed');
      }
  
      const wnfsKey = new Uint8Array(
        signature.slice(2).match(/.{1,2}/g)!
          .map(byte => parseInt(byte, 16))
      ).slice(0, 32);

      console.log({signature, wnfsKey});
  
      localStorage.setItem('wnfs_credentials', JSON.stringify({ 
        password: currentPassword, 
        signature,
        rootCid
      }));
      
      // If rootCid is provided, convert it to Uint8Array
      let rootCidBytes: Uint8Array | undefined;
      if (rootCid) {
        rootCidBytes = new Uint8Array(
          rootCid.startsWith('0x') ? 
            rootCid.slice(2).match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)) :
            rootCid.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
        );
      }
      
      onKeyGenerated(wnfsKey, rootCidBytes);
    } catch (err) {
      console.error('Error:', err);
      alert('Unable to sign the message! Make sure your wallet is connected and you have an account selected.');
    } finally {
      setLinking(false);
    }
  };

  const handleConnect = async () => {
    if (!password || !isUnderstandChecked || !isMetamaskChecked) {
      alert('Please complete all required fields and checkboxes.');
      return;
    }

    try {
      const modal = (window as any).web3Modal;
      modal.open({ view: 'Connect' });
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  return (
    <Container>
      <Title>Set WNFS Identity</Title>
      <Input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Enter Root CID (optional)"
        value={rootCid}
        onChange={(e) => setRootCid(e.target.value)}
      />
      <CheckboxContainer>
        <label>
          <input
            type="checkbox"
            checked={isUnderstandChecked}
            onChange={(e) => setIsUnderstandChecked(e.target.checked)}
          />
          I understand the risk of losing my password
        </label>
        <label>
          <input
            type="checkbox"
            checked={isMetamaskChecked}
            onChange={(e) => setIsMetamaskChecked(e.target.checked)}
          />
          I have MetaMask extension installed
        </label>
      </CheckboxContainer>
      <Button
        disabled={!password || !isUnderstandChecked || !isMetamaskChecked}
        onClick={handleConnect}
      >
        Sign with MetaMask
      </Button>
    </Container>
  );
};

export default WNFSSetup;

const Container = styled.div`
  padding: 2rem;
  max-width: 500px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${props => props.disabled ? '#ccc' : '#007bff'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;
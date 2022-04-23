import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import classNames from "classnames";
import configs from "../../utils/configs";
import { getAppLogo } from "../../utils/get-app-logo";
import { CreateRoomButton } from "./CreateRoomButton";
import { PWAButton } from "./PWAButton";
import { useFavoriteRooms } from "./useFavoriteRooms";
import { usePublicRooms } from "./usePublicRooms";
import styles from "./HomePage.scss";
import { AuthContext } from "../auth/AuthContext";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import { MediaGrid } from "../room/MediaGrid";
import { MediaTile } from "../room/MediaTiles";
import { PageContainer } from "../layout/PageContainer";
import { scaledThumbnailUrlFor } from "../../utils/media-url-utils";
import { Column } from "../layout/Column";
import { Container } from "../layout/Container";
import { SocialBar } from "../home/SocialBar";
import { SignInButton } from "./SignInButton";
import { Button as InputButton } from "./Button";
import maskEmail from "../../utils/mask-email";
import { ReactComponent as HmcLogo } from "../icons/HmcLogo.svg";
import { useWeb3React } from "@web3-react/core";
import { VStack, useDisclosure, Button, Text, HStack, Select, Input, Box, Flex, Tooltip } from "@chakra-ui/react";
import WalletModal from "./WalletModal";
import { networkParams } from "./networks";
import { toHex, truncateAddress } from "./utils";
import { connectors } from "./connectors";
import { CheckCircleIcon, WarningIcon, InfoIcon } from "@chakra-ui/icons";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import Web3AuthComponent from "./Web3AuthComponent";

export function HomePage() {
  const auth = useContext(AuthContext);
  const intl = useIntl();

  const { results: favoriteRooms } = useFavoriteRooms();
  const { results: publicRooms } = usePublicRooms();

  const sortedFavoriteRooms = Array.from(favoriteRooms).sort((a, b) => b.member_count - a.member_count);
  const sortedPublicRooms = Array.from(publicRooms).sort((a, b) => b.member_count - a.member_count);
  const wrapInBold = chunk => <b>{chunk}</b>;
  const isHmc = configs.feature("show_cloud");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { library, chainId, account, activate, deactivate, active } = useWeb3React();

  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();

  const handleNetwork = e => {
    const id = e.target.value;
    setNetwork(Number(id));
  };

  const handleInput = e => {
    const msg = e.target.value;
    setMessage(msg);
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]]
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const signMessage = async () => {
    if (!library) return;
    try {
      const signature = await library.provider.request({
        method: "personal_sign",
        params: [message, account]
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error) {
      setError(error);
    }
  };

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = await library.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature]
      });
      setVerified(verify === account.toLowerCase());
    } catch (error) {
      setError(error);
    }
  };

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    const qs = new URLSearchParams(location.search);

    // Support legacy sign in urls.
    if (qs.has("sign_in")) {
      const redirectUrl = new URL("/signin", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    } else if (qs.has("auth_topic")) {
      const redirectUrl = new URL("/verify", window.location);
      redirectUrl.search = location.search;
      window.location = redirectUrl;
    }

    if (qs.has("new")) {
      createAndRedirectToNewHub(null, null, true);
    }

    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
  }, []);

  const canCreateRooms = !configs.feature("disable_room_creation") || auth.isAdmin;
  const email = auth.email;
  return (
    <>
      <PageContainer className={styles.homePage}>
        <Container>
          <div className={styles.hero}>
            {auth.isSignedIn ? (
              <div className={styles.signInContainer}>
                <span>
                  <FormattedMessage
                    id="header.signed-in-as"
                    defaultMessage="Signed in as {email}"
                    values={{ email: maskEmail(email) }}
                  />
                </span>
                <a href="#" onClick={auth.signOut} className={styles.mobileSignOut}>
                  <FormattedMessage id="header.sign-out" defaultMessage="Sign Out" />
                </a>
              </div>
            ) : (
              <SignInButton mobile />
            )}
            <div className={styles.logoContainer}>
              {isHmc ? (
                <HmcLogo className="hmc-logo" />
              ) : (
                <img alt={configs.translation("app-name")} src={getAppLogo()} />
              )}
            </div>
            <div className={styles.appInfo}>
              <div className={styles.appDescription}>{configs.translation("app-description")}</div>
              {canCreateRooms && <CreateRoomButton />}
              <PWAButton />
            </div>
            <div className={styles.heroImageContainer}>
              <img
                alt={intl.formatMessage(
                  {
                    id: "home-page.hero-image-alt",
                    defaultMessage: "Screenshot of {appName}"
                  },
                  { appName: configs.translation("app-name") }
                )}
                src={configs.image("home_background")}
              />
            </div>
          </div>
        </Container>
        {configs.feature("show_feature_panels") && (
          <Container className={classNames(styles.features, styles.colLg, styles.centerLg)}>
            <Column padding gap="xl" className={styles.card}>
              <img src={configs.image("landing_rooms_thumb")} />
              <h3>
                <FormattedMessage id="home-page.rooms-title" defaultMessage="Instantly create rooms" />
              </h3>
              <p>
                <FormattedMessage
                  id="home-page.rooms-blurb"
                  defaultMessage="Share virtual spaces with your friends, co-workers, and communities. When you create a room with Hubs, you’ll have a private virtual meeting space that you can instantly share <b>- no downloads or VR headset necessary.</b>"
                  values={{ b: wrapInBold }}
                />
              </p>
            </Column>
            <Column padding gap="xl" className={styles.card}>
              <img src={configs.image("landing_communicate_thumb")} />
              <h3>
                <FormattedMessage id="home-page.communicate-title" defaultMessage="Communicate and Collaborate" />
              </h3>
              <p>
                <FormattedMessage
                  id="home-page.communicate-blurb"
                  defaultMessage="Choose an avatar to represent you, put on your headphones, and jump right in. Hubs makes it easy to stay connected with voice and text chat to other people in your private room."
                />
              </p>
            </Column>
            <Column padding gap="xl" className={styles.card}>
              <img src={configs.image("landing_media_thumb")} />
              <h3>
                <FormattedMessage id="home-page.media-title" defaultMessage="An easier way to share media" />
              </h3>
              <p>
                <FormattedMessage
                  id="home-page.media-blurb"
                  defaultMessage="Share content with others in your room by dragging and dropping photos, videos, PDF files, links, and 3D models into your space."
                />
              </p>
            </Column>
          </Container>
        )}
        <Container className={styles.roomsContainer}>
          <h3 className={styles.roomsHeading}>
            <FormattedMessage
              id="home-page.connect--wallet"
              defaultMessage="Step 1: Connect your Wallet or Login    "
            />
            <span />
            <Tooltip
              label="By connecting your wallet, it will enable you to receive rewards by interacting with our communities through the DAOVerse in the form of NFT badges, social tokens, and POAPs."
              fontSize="md"
            >
              <InfoIcon />
            </Tooltip>
          </h3>
          <HStack justify="center" spacing="40px">
            <VStack justifyContent="center">
              <h2>New to web3? Log in with the social networks you are already familiar with.</h2>
              <Web3AuthComponent />
            </VStack>
            <VStack justifyContent="center">
              <h2>Already have a wallet? Connect with Coinbase Wallet, WalletConnect or Metamask.</h2>
              {!active ? <Button onClick={onOpen}>Connect</Button> : <Button onClick={disconnect}>Disconnect</Button>}
              <Text>{`Connection Status: `}</Text>
              {active ? <CheckCircleIcon color="green" /> : <WarningIcon color="#cd5700" />}

              <Tooltip label={account} placement="right">
                <Text>{`Account: ${truncateAddress(account)}`}</Text>
              </Tooltip>
            </VStack>
          </HStack>
        </Container>
        {sortedPublicRooms.length > 0 && (
          <Container className={styles.roomsContainer}>
            <h3 className={styles.roomsHeading}>
              <FormattedMessage id="home-page.public--rooms" defaultMessage="Step 2: Join a DAOVerse" />
            </h3>
            <Column grow padding className={styles.rooms}>
              <MediaGrid center>
                {sortedPublicRooms.map(room => {
                  return (
                    <MediaTile
                      key={room.id}
                      entry={room}
                      processThumbnailUrl={(entry, width, height) =>
                        scaledThumbnailUrlFor(entry.images.preview.url, width, height)
                      }
                    />
                  );
                })}
              </MediaGrid>
            </Column>
          </Container>
        )}
        {sortedFavoriteRooms.length > 0 && (
          <Container className={styles.roomsContainer}>
            <h3 className={styles.roomsHeading}>
              <FormattedMessage id="home-page.favorite-rooms" defaultMessage="Favorite Rooms" />
            </h3>
            <Column grow padding className={styles.rooms}>
              <MediaGrid center>
                {sortedFavoriteRooms.map(room => {
                  return (
                    <MediaTile
                      key={room.id}
                      entry={room}
                      processThumbnailUrl={(entry, width, height) =>
                        scaledThumbnailUrlFor(entry.images.preview.url, width, height)
                      }
                    />
                  );
                })}
              </MediaGrid>
            </Column>
          </Container>
        )}
        <Container>
          <Column center grow>
            <InputButton thin preset="landing" as="a" href="/link">
              <FormattedMessage id="home-page.have-code" defaultMessage="Have a room code?" />
            </InputButton>
          </Column>
        </Container>
        {isHmc ? (
          <Column center>
            <SocialBar />
          </Column>
        ) : null}
      </PageContainer>
      <WalletModal isOpen={isOpen} closeModal={onClose} />
    </>
  );
}

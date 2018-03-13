import * as SimplePeer from 'simple-peer';

export enum VC_STATE {
  INIT,
  JOINED,
  READY,
  NEGOTIATED,
  CONNECTING,
  CONNECTED
}

export interface VideochatMedia {
  available: {
    cam: boolean,
    mic: boolean
  };
  active: {
    cam: boolean,
    mic: boolean
  };
}

export interface VideochatData {
  status: VC_STATE;
  loadingMessage: string;
  initiator?: boolean;
  media?: VideochatMedia;
  oppMedia?: VideochatMedia;
  peer?: SimplePeer;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
}

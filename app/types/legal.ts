export interface LegalLink {
  label: string;
  href: string;
}

export interface LegalTexts {
  avisoLegal: {
    title: string;
    lastUpdated: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
  privacidad: {
    title: string;
    lastUpdated: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
  cookies: {
    title: string;
    lastUpdated: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
  cancelaciones: {
    title: string;
    lastUpdated: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
}

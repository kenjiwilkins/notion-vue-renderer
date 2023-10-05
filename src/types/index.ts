export interface IBlocks {
  IHeading1: IHeading1;
}
export const IBLOCKS = {
  heading_1: "heading_1",
  heading_2: "heading_2",
  heading_3: "heading_3",
  paragraph: "paragraph",
  bulleted_list_item: "bulleted_list_item",
};

export interface IRichText {
  type: "text";
  text: IText;
  annotations: IAnnotations;
  href?: string;
}

export interface IAnnotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface IText {
  content: string;
  link: null;
}

export interface IHeading1 {
  type: "heading_1";
  heading_1: {
    rich_text: IRichText[];
  };
  plain_text: string;
}

export interface IHeading2 {
  type: "heading_2";
  heading_2: {
    rich_text: IRichText[];
  };
  plain_text: string;
}

export interface IHeading3 {
  type: "heading_3";
  heading_3: {
    rich_text: IRichText[];
  };
  plain_text: string;
}

export interface IParagraph {
  type: "paragraph";
  paragraph: {
    rich_text: IRichText[];
  };
  plain_text: string;
}

export interface IBulletedListItem {
  type: "bulleted_list_item";
  bulleted_list_item: {
    rich_text: IRichText[];
  };
  plain_text: string;
}

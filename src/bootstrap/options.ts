import { HelperDelegate } from "handlebars";

export interface GeneratorOptions {
  modelFolder: string;
  enumTSFile: string;

  generateBarrelFiles?: boolean;
  generateClasses?: boolean;
  generateFormGroups?: boolean;
  generateValidatorFile?: boolean;
  baseModelFileName?: string;
  subTypeFactoryFileName?: string;
  validatorsFileName?: string;
  exclude?: (string | RegExp)[];
  enumI18NHtmlFile?: string;
  enumLanguageFiles?: string[];
  modelModuleName?: string;
  enumModuleName?: string;
  enumRef?: string;
  subTypePropertyName?: string;
  namespacePrefixesToRemove?: string[];
  typeNameSuffixesToRemove?: string[];
  typesToFilter?: string[];
  sortModelProperties?: boolean;
  sortEnumTypes?: boolean;

  templates?: {
    validators?: string;
    baseModel?: string;
    models?: string;
    subTypeFactory?: string;
    barrel?: string;
    enum?: string;
    enumLanguage?: string;
    helpers?: HelperList;
  };
}

export type HelperList = {
  [helperName: string]: HelperDelegate;
}

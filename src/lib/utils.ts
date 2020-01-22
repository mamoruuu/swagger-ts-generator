import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync, lstatSync, unlinkSync, rmdirSync } from 'fs';
import { dirname, join } from 'path';
import { compile, registerHelper } from 'handlebars';
import * as moment from 'moment';
import { kebabCase, find, sortBy, toPairs, fromPairs } from 'lodash';
import { SwaggerDefinition } from '../bootstrap/swagger';
import { GeneratorOptions, HelperList } from '../bootstrap/options';

export const ENCODING = 'utf8';

export function readAndCompileTemplateFile(templatePath: string, helperList?: HelperList) {
    registerTemplateHelpers(helperList);
    let templateSource = readFileSync(templatePath, ENCODING);
    let template = compile(templateSource);
    return template;
}

function readFile(outputFileName: string) {
    let file = readFileSync(outputFileName, ENCODING);
    return file;
}

function writeFile(outputFileName: string, contents: string) {
    writeFileSync(outputFileName, contents, { flag: 'w', encoding: ENCODING });
}

export function registerTemplateHelpers(helperList: HelperList = {}): void {
    for (let helperName in helperList) {
        if (helperList.hasOwnProperty(helperName)) {
            registerHelper(helperName, helperList[helperName]);
        }
    }
}

export function writeFileIfContentsIsChanged(outputFileName: string, contents: string) {
    let isChanged = true;
    if (existsSync(outputFileName)) {
        let oldContents = readFile(outputFileName);
        isChanged = oldContents !== contents;
    }
    if (isChanged) {
        writeFile(outputFileName, contents);
    }
    return isChanged;
}

export function ensureFile(outputFileName: string, contents: string) {
    ensureFolder(dirname(outputFileName));
    if (!existsSync(outputFileName)) {
        writeFileSync(outputFileName, contents, ENCODING);
    }
}

export function ensureFolder(folder: string) {
    if (!existsSync(folder)) {
        mkdirSync(folder);
    }
}

export function getDirectories(srcpath: string) {
    return readdirSync(srcpath).filter((file) => {
        return statSync(join(srcpath, file)).isDirectory();
    });
}

export function removeFolder(folder: string) {
    if (existsSync(folder)) {
        readdirSync(folder).forEach((file, index) => {
            let curPath = folder + "/" + file;
            if (lstatSync(curPath).isDirectory()) { // recurse
                removeFolder(curPath);
            } else { // delete file
                unlinkSync(curPath);
            }
        });
        rmdirSync(folder);
    }
}

export function getPathToRoot(namespace: string) {
    let path = './';
    if (namespace) {
        path = '';
        let namespaceLength = namespace.split('.').length;
        for (let i = 0; i < namespaceLength; ++i) {
            path += '../';
        }
    }
    return path;
}

export function convertNamespaceToPath(namespace: string) {
    let parts = namespace.split('.');
    for (let index = 0; index < parts.length; index++) {
        parts[index] = kebabCase(parts[index]);
    }
    let result = parts.join('/');
    // let result = namespace.replace(/\./g, '/');
    return result;
}

export function getTypeFromDescription(description: string) {
    if (hasTypeFromDescription(description)) {
        description = description.replace('ts-type', '');
        return description.replace('type', '').trim();
    }
    return description;
}
export function hasTypeFromDescription(description: string) {
    if (description) {
        return (description.startsWith('ts-type') || description.startsWith('type'));
    }
    return false;
}

export function getSortedObjectProperties(object: Object) {
    const pairs = sortBy(toPairs(object), 0);
    const result = fromPairs(pairs as [string, {}][]);
    return result;
}

export function isInTypesToFilter(item: SwaggerDefinition, key: string, options: GeneratorOptions) {
    if (options && options.typesToFilter) {
        const result = !!find(options.typesToFilter, element => { return element === key; });
        // if (result) {
        //     console.log('item in typesToFilter', key, result);
        // }
        return result;
    }
    return false;
}

export function removeExtension(file: string) {
    return file.replace('.ts', '');
}

export function log(message: string) {
    let time = moment().format('HH:mm:SS');
    console.log(`[${time}] ${message}`);
}

// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html

interface PluginsConfing{
  plugins: Array<any>,
  size: number,
}

export namespace SVGParser {
  /*~ For example, given this definition, someone could write:
   *~   import { subProp } from 'yourModule';
   *~   subProp.foo();
   *~ or
   *~   import * as yourMod from 'yourModule';
   *~   yourMod.subProp.foo();
   */
  export function parse(filePath: string, confing: PluginsConfing ): SVGParser;

  export function parseStr(dataStr: string, confing: PluginsConfing ): SVGParser;

  export function parseNode(Node: any, confing: PluginsConfing ): SVGParser;

  export function toSimpleSvg(): string;

  export function getPathAttributes(): Array<any>;
}

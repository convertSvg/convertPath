
// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html

interface PluginsConfing{
  plugins: Array<any>,
  size?: number,
}

declare module 'convertpath' {
  /*~ For example, given this definition, someone could write:
   *~   import * as subProp from 'yourModule';
   *~   subProp.foo();
   *~ or
   *~   import {} from 'yourModule';
   *~   subProp.foo();
   */

  export function parse(filePath: string, confing: PluginsConfing ): SVGParser;

  export function parseStr(dataStr: string, confing: PluginsConfing ): SVGParser;

  export function parseNode(Node: any, confing: PluginsConfing ): SVGParser;

  export function toSimpleSvg(): string;

  export function getPathAttributes(): Array<any>;
}

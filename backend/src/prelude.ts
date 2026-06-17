import Module from 'node:module';
import * as path from 'node:path';

const originalRequire = Module.prototype.require;

(Module.prototype as any).require = function (this: any, id: string) {
  const self = this;
  if (id === 'bindings') {
    return function (this: any, name: string) {
      if (name === 'better_sqlite3.node') {
        if ((process as any).pkg) {
          const externalAddonPath = path.join(path.dirname(process.execPath), 'better_sqlite3.node');
          return originalRequire.call(self, externalAddonPath);
        } else {
          try {
            const sqliteModuleDir = path.dirname(require.resolve('better-sqlite3/package.json'));
            const addonPath = path.join(sqliteModuleDir, 'build', 'Release', 'better_sqlite3.node');
            return originalRequire.call(self, addonPath);
          } catch (e) {
            console.error('[Prelude SQLite Native Load Error]:', e);
          }
        }
      }
      const realBindings = originalRequire.call(self, 'bindings');
      return realBindings.apply(self, arguments as any);
    };
  }
  return originalRequire.apply(this, arguments as any);
};

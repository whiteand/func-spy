import { IMetadata, iterate, Path, spy, typeToStringTypes } from '../src';
const ID_TEST = /^[a-zA-Z_][a-zA-Z_0-9]*$/;
function pathToString(path: Path[]) {
  if (path.length <= 0) return '';
  const items = [
    typeof path[0] === 'number'
      ? `[${path[0]}]`
      : ID_TEST.test(path[0].toString())
      ? path[0].toString()
      : `[${JSON.stringify(path[0].toString())}]`,
  ];
  for (let i = 1; i < path.length; i++) {
    const p = path[i];
    if (typeof p === 'number') {
      items.push(`[${p}]`);
      continue;
    }
    const k = p.toString();
    if (ID_TEST.test(k)) {
      return `.${k}`;
    }
    return `[${JSON.stringify(k)}]`;
  }
  return items.join('');
}
function collect(value: IMetadata<any>): string {
  const lines: string[] = [];
  iterate(m => {
    lines.push(
      `${pathToString(m.path)}: ${typeToStringTypes(m.type).join(' | ')}`
    );
  }, value);
  return lines.join(';\n');
}

describe('spy', () => {
  it('00. primitive', () => {
    const res = spy((x: number) => x * 2, 2);
    expect(res).toMatchSnapshot();
    expect(collect(res.metadata)).toMatchInlineSnapshot();
  });
  it('01. date', () => {
    const res = spy((x: Date) => x.toString(), new Date(2021, 11, 19));
    expect(res).toMatchSnapshot();
    expect(collect(res.metadata)).toMatchInlineSnapshot();
  });
  it('02. array', () => {
    const res = spy((x: number[]) => x.map(y => y * 2), [1, 2]);
    expect(res).toMatchSnapshot();
    expect(collect(res.metadata)).toMatchInlineSnapshot();
  });
  it('03. object', () => {
    const res = spy((x: Record<string, string>) => Object.keys(x), {
      andrew: 'beletskiy',
      vasilina: 'beletskaya',
    });
    expect(res).toMatchSnapshot();
    expect(collect(res.metadata)).toMatchInlineSnapshot();
  });
  it('04. nested', () => {
    const res = spy((x: any) => x?.data?.[0]?.name, {
      data: [{ name: 42 }],
    });
    expect(res).toMatchSnapshot();
    expect(collect(res.metadata)).toMatchInlineSnapshot();
  });
});

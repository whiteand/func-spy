import { IMetadata, iterate, Path, spy, Type, typeToStringTypes } from '../src';
const ID_TEST = /^[a-zA-Z_][a-zA-Z_0-9]*$/;
const NUM_TEST = /^\d+\.?\d*$/;
function pathToString(path: Path[]) {
  if (path.length <= 0) return '';
  const items = [
    typeof path[0] === 'number' || NUM_TEST.test(path[0].toString())
      ? `[${path[0].toString()}]`
      : ID_TEST.test(path[0].toString())
      ? path[0].toString()
      : `[${JSON.stringify(path[0].toString())}]`,
  ];
  for (let i = 1; i < path.length; i++) {
    const p = path[i];
    if (typeof p === 'number' || NUM_TEST.test(p.toString())) {
      items.push(`[${p.toString()}]`);
      continue;
    }
    const k = p.toString();
    if (ID_TEST.test(k)) {
      items.push(`.${k}`);
      continue;
    }
    items.push(`[${JSON.stringify(k)}]`);
  }
  return items.join('');
}
function collect(value: IMetadata<any>): string {
  const lines: string[] = [];
  iterate(m => {
    lines.push(
      `${pathToString(m.path)}: ${
        (m.type & Type.Function) === Type.Function
          ? m.data[0]?.name?.toString?.() + '()'
          : typeToStringTypes(m.type).join(' | ')
      }`
    );
  }, value);
  return lines.join(';\n');
}

describe('spy', () => {
  it('00. primitive', () => {
    const res = spy((x: number) => x * 2, 2);
    expect(res).toMatchSnapshot();
    expect(collect(res.metadata)).toMatchInlineSnapshot(`": number"`);
  });
  it('01. date', () => {
    const res = spy((x: Date) => x.toString(), new Date(2021, 11, 19));
    expect(res).toMatchSnapshot();
    expect(collect(res.metadata)).toMatchInlineSnapshot(`": date"`);
  });
  it('02. array', () => {
    const res = spy((x: number[]) => x.map(y => y * 2), [1, 2]);
    expect(res).toMatchSnapshot();
    expect(collect(res.metadata)).toMatchInlineSnapshot(`
      ": array;
      constructor: Array();
      length: number;
      map: map();
      [1]: number;
      [0]: number"
    `);
  });
  it('03. object', () => {
    const res = spy((x: Record<string, string>) => Object.keys(x), {
      andrew: 'beletskiy',
      vasilina: 'beletskaya',
    });
    expect(res).toMatchSnapshot();
    expect(collect(res.metadata)).toMatchInlineSnapshot(`": object"`);
  });
  it('04. nested', () => {
    const res = spy((x: any) => x?.data?.[0]?.name, {
      data: [{ name: 42 }],
    });
    expect(res).toMatchSnapshot();
    expect(collect(res.metadata)).toMatchInlineSnapshot(`
      ": object;
      data: array;
      data[0]: object;
      data[0].name: number"
    `);
  });
  test('05. docs', () => {
    const { result, metadata } = spy(state => state?.users?.[0]?.name, {
      users: [{ name: 'andrew' }],
    });

    expect(result).toMatchSnapshot();
    const res: any[] = [];
    iterate(node => {
      res.push([node.path], typeToStringTypes(node.type));
    }, metadata);
    expect(res).toMatchSnapshot();
  });
});

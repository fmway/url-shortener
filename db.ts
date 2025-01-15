export class DB {
  kv: Promise<Deno.Kv>;

  constructor() {
    this.kv = Deno.openKv(Deno.env.get("DENOKV_URL"));
    return this;
  }

  randomId(): string {
    return makeId(7);
  }

  async createLink(to: Data["to"], from?: Data["from"]): Promise<({success:false,message:string}|{success:true,result:Data})> {
    const id = (from && from != "") ? from : this.randomId();
    if (await this.isExist(id)) 
      return { success: false, message: "id is exist" };
    await (await this.kv).set(["short", id], { from: id, to, });
    return { success: true, result: { from: id, to } };
  }

  async isExist(id: string): Promise<boolean> {
    const res = await (await this.kv).get<Data>(["short", id]);
    if (res.value)
      return true;
    return false;
  }

  async getLink(id: string): Promise<Data|null> {
    if (!await this.isExist(id))
      return null;
    return (await (await this.kv).get<Data>(["short", id])).value;
  }
}

export interface Data {
  from: string,
  to: string | string[] | Record<string, string>,
}

export function makeId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

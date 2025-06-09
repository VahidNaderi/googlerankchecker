export class RankStorageModel{
    hostname:string;
    keywords:{keyword:string,rankHistory:{date:string,rank:number} []} [];
}
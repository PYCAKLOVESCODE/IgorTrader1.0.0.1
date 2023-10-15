import { DependencyContainer } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderConfig } from "@spt-aki/models/spt/config/ITraderConfig";
import { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

// New trader settings
import * as baseJson from "../db/base.json";
import { TraderHelper } from "./traderHelpers";
import { FluentAssortConstructor } from "./fluentTraderAssortCreator";
import { Money } from "@spt-aki/models/enums/Money";
import { Traders } from "@spt-aki/models/enums/Traders";
import { HashUtil } from "@spt-aki/utils/HashUtil";

class SampleTrader implements IPreAkiLoadMod, IPostDBLoadMod
{
    private mod: string
    private logger: ILogger
    private traderHelper: TraderHelper
    private fluentTraderAssortHeper: FluentAssortConstructor

    constructor() {
        this.mod = "IgorTrader"; // Set name of mod so we can log it to console later
    }

    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    public preAkiLoad(container: DependencyContainer): void
    {
        // Get a logger
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);

        // Get SPT code/data we need later
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const hashUtil: HashUtil = container.resolve<HashUtil>("HashUtil");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        // Create helper class and use it to register our traders image/icon + set its stock refresh time
        this.traderHelper = new TraderHelper();
        this.fluentTraderAssortHeper = new FluentAssortConstructor(hashUtil, this.logger);
        this.traderHelper.registerProfileImage(baseJson, this.mod, preAkiModLoader, imageRouter, "igortrader.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, 3600);

        // Add trader to trader enum
        Traders[baseJson._id] = baseJson._id;

        // Add trader to flea market
        ragfairConfig.traders[baseJson._id] = true;

        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }
    
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    public postDBLoad(container: DependencyContainer): void
    {
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        // Resolve SPT classes we'll use
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer: ConfigServer = container.resolve<ConfigServer>("ConfigServer");
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");

        // Get a reference to the database tables
        const tables = databaseServer.getTables();

        // Add new trader to the trader dictionary in DatabaseServer - has no assorts (items) yet
        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil);

        // Add TNT Brick
        this.fluentTraderAssortHeper.createSingleAssortItem("60391b0fb847c71012789415")
                                    .addStackCount(20)
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 21999)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        // Add Zarya
        this.fluentTraderAssortHeper.createSingleAssortItem("5a0c27731526d80618476ac4")
                                    .addStackCount(200)
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 6999)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
        
        // Add Model 7290
        this.fluentTraderAssortHeper.createSingleAssortItem("619256e5f8af2c1a4e1f5d92")
                                    .addStackCount(100)
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 9750)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        // Add RDG-5
        this.fluentTraderAssortHeper.createSingleAssortItem("5448be9a4bdc2dfd2f8b456a")
                                    .addStackCount(75)
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 10000)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                    
        // Add F1
        this.fluentTraderAssortHeper.createSingleAssortItem("5710c24ad2720bc3458b45a3")
                                    .addStackCount(35)
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 12000)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                                                        
        // Add M67
        this.fluentTraderAssortHeper.createSingleAssortItem("58d3db5386f77426186285a0")
                                    .addStackCount(20)
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 13500)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                                                        
        // Add Grenade Case
        this.fluentTraderAssortHeper.createSingleAssortItem("5e2af55f86f7746d4159f07c")
                                    .addStackCount(5)
                                    .addBuyRestriction(1)
                                    .addMoneyCost(Money.ROUBLES, 400000)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                                                        
        // Add Fuze
        this.fluentTraderAssortHeper.createSingleAssortItem("5e2af51086f7746d3f3c3402")
                                    .addStackCount(300)
                                    .addBuyRestriction(12)
                                    .addMoneyCost(Money.ROUBLES, 12475)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                                                        
        // Add VOG-17
        this.fluentTraderAssortHeper.createSingleAssortItem("5e32f56fcb6d5863cc5e5ee4")
                                    .addStackCount(100)
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 20000)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
        // Add VOG-25
        this.fluentTraderAssortHeper.createSingleAssortItem("5e340dcdcb6d5863cc5e5efb")
                                    .addStackCount(50)
                                    .addBuyRestriction(10)
                                    .addMoneyCost(Money.ROUBLES, 27899)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
        
        // Add Thermite
        this.fluentTraderAssortHeper.createSingleAssortItem("60391a8b3364dc22b04d0ce5")
                                    .addStackCount(300)
                                    .addBuyRestriction(1)
                                    .addMoneyCost(Money.ROUBLES, 100000)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
        // Add some singular items to trader (items without sub-items e.g. milk/bandage)
        //this.traderHeper.addSingleItemsToTrader(tables, baseJson._id);

        // Add more complex items to trader (items with sub-items, e.g. guns)
        //this.traderHeper.addComplexItemsToTrader(tables, baseJson._id, jsonUtil);

        // Add trader to locale file, ensures trader text shows properly on screen
        // WARNING: adds the same text to ALL locales (e.g. chinese/french/english)
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, "Igor", baseJson.nickname, baseJson.location, "Former military demolition expert renowned for his expertise in all things explosive. Igor's arsenal of fragmentation grenades and grenade launchers is unmatched, making him the go-to source for the most devastating ordnance in Tarkov's unforgiving battles.");

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
}

module.exports = { mod: new SampleTrader() }
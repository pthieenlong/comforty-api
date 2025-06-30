import { ERole } from "@/types/interface/User.type";
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from "@casl/ability";

export type Subjects = 'User' | 'Product' | 'Category' | 'all';
export enum Actions {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete'
}

export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

export interface IUserForCASL {
  _id: string | undefined;
  roles: ERole[] | undefined;
  username: string | undefined;
}

class CASLModule {
  private static instance: CASLModule;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): CASLModule {
    if(!CASLModule.instance) {
      CASLModule.instance = new CASLModule();
    }
    return CASLModule.instance;
  }

  public initialize() {
    if(this.isInitialized) {
      console.log('CASL Module already initialize');
      return;
    }

    console.log('CASL Module initialized successfully');
    this.isInitialized = true;
  }
  public createAbilityForUser(user: IUserForCASL | null): AppAbility {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(AppAbility);

    if(!user) {
      this.setGuestPermissions(can);
    } else {
      this.setUserPermissions(can, user);
    }

    return build({
      detectSubjectType: (item: any) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  private setGuestPermissions(can: any) {
    can(Actions.READ, 'Product');
    can(Actions.READ, 'Category');
  }

  private setUserPermissions(can: any, user: IUserForCASL) {
    
    if(user.roles?.includes(ERole.USER)) {
      this.setRegularUserPermissions(can, user);
    }
    if(user.roles?.includes(ERole.ADMIN)) {
      this.setAdminPermissions(can);
    }
  }

  private setRegularUserPermissions(can: any, user: IUserForCASL) {
    can(Actions.READ, 'Product');
    can(Actions.READ, 'Category');

    can(Actions.READ, 'User', { _id: user._id });
    can(Actions.UPDATE, 'User', { _id: user._id });
  }

  private setAdminPermissions(can: any) { 
    can(Actions.MANAGE, 'all');
  }
  public getActions() {
    return Actions;
  }

  public getSubjects(): string[] {
    return ['User', 'Product', 'Category', 'all'];
  }

  public can(ability: AppAbility, action: Actions, subject: Subjects, field?: string) {
    return ability.can(action, subject, field);
  }
  public cannot(ability: AppAbility, action: Actions, subject: Subjects, field?: string): boolean {
    return ability.cannot(action, subject, field);
  }

  public getUserPermissions(user: IUserForCASL | null): any {
    const ability = this.createAbilityForUser(user);
    
    return {
      user: user ? {
        id: user._id,
        username: user.username,
        roles: user.roles
      } : null,
      permissions: {
        canCreate: {
          user: this.can(ability, Actions.CREATE, 'User'),
          product: this.can(ability, Actions.CREATE, 'Product'),
          category: this.can(ability, Actions.CREATE, 'Category'),
        },
        canRead: {
          user: this.can(ability, Actions.READ, 'User'),
          product: this.can(ability, Actions.READ, 'Product'),
          category: this.can(ability, Actions.READ, 'Category'),
        },
        canUpdate: {
          user: this.can(ability, Actions.UPDATE, 'User'),
          product: this.can(ability, Actions.UPDATE, 'Product'),
          category: this.can(ability, Actions.UPDATE, 'Category'),
        },
        canDelete: {
          user: this.can(ability, Actions.DELETE, 'User'),
          product: this.can(ability, Actions.DELETE, 'Product'),
          category: this.can(ability, Actions.DELETE, 'Category'),
        },
        canManage: {
          all: this.can(ability, Actions.MANAGE, 'all'),
        }
      }
    };
  }
  public validatePermission(action: Actions, subject: Subjects): boolean {
    const validActions = Object.values(Actions);
    const validSubjects = this.getSubjects();
    
    return validActions.includes(action) && validSubjects.includes(subject);
  }
}

export const caslModule = CASLModule.getInstance();